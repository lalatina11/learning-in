<?php

namespace App\Http\Controllers;

use App\Models\ClassRoom;
use App\Models\Major;
use App\Models\StudyRoom;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    private function getMajorById($id)
    {
        return Major::findOrFail($id);
    }

    public function showAdminDashboard()
    {
        return Inertia::render("dashboard/admin/index");
    }

    public function showManageUserDashboard()
    {
        $users = User::where('role', '!=', 'ADMIN')->get();
        return Inertia::render("dashboard/admin/user", compact("users"));
    }
    public function createUser(Request $request)
    {
        $validated = $request->validate([
            "master_number" => "string|min:8|max:16",
            "name" => "string|min:3",
            "email" => "string|email",
            "password" => "string|min:8",
            "role" => "required|string|in:ADMIN,TEACHER,STUDENT",
        ]);

        $existingMasterNumber = User::where("master_number", $validated['master_number'])->first();

        if ($existingMasterNumber) {
            return redirect()->back()->withErrors("NIM/NIK sudah digunakan, tolong ganti", "server");
        }
        $existingEmail = User::where("email", $validated['email'])->first();

        if ($existingEmail) {
            return redirect()->back()->withErrors("Email sudah digunakan, tolong ganti", "server");
        }

        $user = User::create($validated);

        if (!$user) {
            return redirect()->back()->withErrors("Gagal Membuat user baru", "server");
        }

        return redirect()->back();
    }
    public function updateUser($id, Request $request)
    {
        $validated = $request->validate([
            "master_number" => "string|min:8|max:16",
            "name" => "string|min:3",
            "email" => "string|email",
            "password" => "nullable|string",
        ]);

        $user = User::findOrFail($id);

        if (!$user) {
            return redirect()->back()->withErrors("Pengguna tidak valid", "server");
        }

        $existingMasterNumber = User::where("master_number", $validated['master_number'])->first();

        if ($existingMasterNumber && ($existingMasterNumber->id != $id)) {
            return redirect()->back()->withErrors("NIM/NIK sudah digunakan, tolong ganti", "server");
        }

        $existingEmail = User::where("email", $validated['email'])->first();

        if ($existingEmail && ($existingEmail->id != $id)) {
            return redirect()->back()->withErrors("Email sudah digunakan, tolong ganti", "server");
        }

        $updateData = [
            'master_number' => $validated['master_number'],
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (!empty($validated['password']) || $validated['password'] != "") {
            $updateData['password'] = $validated['password'];
        }

        $user->update($updateData);

        return redirect()->back();
    }
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        if (!$user) {
            return redirect()->back()->withErrors('Pengguna tidak valid', 'server');
        }
        $user->delete();
        return redirect()->back();
    }

    public function showSchoolManagementDashboard()
    {
        $majors = Major::all();
        $classRooms = ClassRoom::with('major')->get();
        $teachers = User::where('role', "TEACHER")->get();
        $studyRooms = StudyRoom::with('teacher')->with('classroom')->get();
        return Inertia::render('dashboard/admin/school', compact('majors', 'classRooms', 'teachers', 'studyRooms'));
    }

    public function createMajor(Request $request)
    {
        $validated = $request->validate([
            "name" => "string|min:3"
        ]);

        $existingMajor = Major::where("name", $validated["name"])->first();

        if ($existingMajor) {
            return redirect()->back()->withErrors("Jurusan dengan nama " . $validated['name'] . " sudah ada, tolong ganti", "server");
        }

        Major::create($validated);

        return redirect()->back();
    }
    public function updateMajor($id, Request $request)
    {
        $validated = $request->validate([
            "name" => "string|min:3"
        ]);

        $existingMajor = $this->getMajorById($id);

        if (!$existingMajor) {
            return redirect()->back()->withErrors("Jurusan ini tidak tersedia", "server");
        }

        $existingMajorName = Major::where("name", $validated["name"])->first();

        if ($existingMajorName && ($existingMajorName['id'] != $existingMajor['id'])) {
            return redirect()->back()->withErrors("Nama Jurusan bentrok dengan jurusan lain", "server");
        }

        $existingMajor->update($validated);

        return redirect()->back();
    }
    public function deleteMajor($id)
    {
        $existingMajor = $this->getMajorById($id);

        if (!$existingMajor) {
            return redirect()->back()->withErrors("Jurusan ini tidak tersedia", "server");
        }

        $existingMajor->delete();

        return redirect()->back();
    }

    public function createClassRoom(Request $request)
    {
        $validated = $request->validate([
            "major_id" => "int|min:1",
            "grade" => "string"
        ]);

        $allowedGrade = ["X", "XI", "XII"];
        if (!in_array($validated['grade'], $allowedGrade, true)) {
            return redirect()->back()->withErrors('Tingkatan kelas tidak valid!', 'server');
        }

        $existingMajor = Major::findOrFail($validated['major_id']);

        if (!$existingMajor) {
            return redirect()->back()->withErrors('Jurusan tidak valid!', 'server');
        }

        $existingClassRoom = ClassRoom::where('grade', $validated['grade'])->where('major_id', $validated['major_id'])->first();

        if ($existingClassRoom) {
            return redirect()->back()->withErrors('Kelas ini bentrok dengan kelas lain!', 'server');
        }

        ClassRoom::create($validated);

        return redirect()->back();
    }

    public function updateClassRoom($id, Request $request)
    {
        $validated = $request->validate([
            "major_id" => "int|min:1",
            "grade" => "string"
        ]);

        $existingClassRoom = ClassRoom::findOrFail($id);

        if (!$existingClassRoom) {
            return redirect()->back()->withErrors('Kelas tidak valid!', 'server');
        }

        $allowedGrade = ["X", "XI", "XII"];
        if (!in_array($validated['grade'], $allowedGrade, true)) {
            return redirect()->back()->withErrors('Tingkatan kelas tidak valid!', 'server');
        }
        $existingMajor = Major::findOrFail($validated['major_id']);
        if (!$existingMajor) {
            return redirect()->back()->withErrors('Jurusan tidak valid!', 'server');

        }

        $existingClassRoom->update($validated);

        return redirect()->back();
    }
    public function deleteClassRoom($id, )
    {

        $existingClassRoom = Major::findOrFail($id);

        if (!$existingClassRoom) {
            return redirect()->back()->withErrors('Kelas tidak valid!', 'server');
        }

        $existingClassRoom->delete();

        return redirect()->back();
    }

    public function createStudyRoom(Request $request)
    {
        $validated = $request->validate([
            'classroom_id' => "int|min:1",
            'teacher_id' => "int|min:1"
        ]);

        $existingClassRoom = ClassRoom::findOrFail($validated["classroom_id"]);

        if (!$existingClassRoom) {
            return redirect()->back()->withErrors('Kelas tidak valid!', 'server');
        }

        $existingTeacher = User::where('id', $validated["teacher_id"])->where('role', "TEACHER")->firstOrFail();

        if (!$existingTeacher) {
            return redirect()->back()->withErrors('Guru tidak valid!', 'server');
        }

        StudyRoom::create($validated);

        return redirect()->back();
    }
    public function updateStudyRoom($id, Request $request)
    {
        $validated = $request->validate([
            'classroom_id' => "int|min:1",
            'teacher_id' => "int|min:1"
        ]);

        $existingStudyRoom = StudyRoom::findOrFail($id);

        if (!$existingStudyRoom) {
            return redirect()->back()->withErrors('KBM tidak valid!', 'server');
        }

        $existingClassRoom = ClassRoom::findOrFail($validated["classroom_id"]);

        if (!$existingClassRoom) {
            return redirect()->back()->withErrors('Kelas tidak valid!', 'server');
        }

        $existingTeacher = User::where('id', $validated["teacher_id"])->where('role', "TEACHER")->firstOrFail();

        if (!$existingTeacher) {
            return redirect()->back()->withErrors('Guru tidak valid!', 'server');
        }

        $existingStudyRoom->update($validated);

        return redirect()->back();
    }
    public function deleteStudyRoom($id)
    {

        $existingStudyRoom = StudyRoom::findOrFail($id);

        if (!$existingStudyRoom) {
            return redirect()->back()->withErrors('KBM tidak valid!', 'server');
        }

        $existingStudyRoom->delete();

        return redirect()->back();
    }

    public function showStudyRoomDetail($id)
    {
        $studyRoom = StudyRoom::where('id', $id)->with('teacher')->with('students')->with('classroom')->first();
        if (!$studyRoom) {
            return redirect()->route('dashboard.admin.manage.school.index');
        }
        $major = Major::where('id', $studyRoom->classroom->major_id)->first();
        $studyRoom->classroom->major = $major;
        return Inertia::render('dashboard/admin/study-room-detail', compact('studyRoom'));
    }
}

