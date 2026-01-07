<?php

namespace App\Http\Controllers;

use App\Models\ClassRoom;
use App\Models\LearningSubject;
use App\Models\Major;
use App\Models\StudyRoom;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            "role" => "required|string",
        ]);

        $allowedRole = ['STUDENT', 'TEACHER', 'ADMIN'];

        if (!in_array($request['role'], $allowedRole)) {
            return redirect()->back()->withErrors("Mohon masukkan role dengan benar!", "server");
        }

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
            "class_room_id" => "nullable|string",
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
        $studyRooms = StudyRoom::with('teacher')->with('classRoom')->with('learning_subject')->get();
        $learningSubjects = LearningSubject::get();
        return Inertia::render('dashboard/admin/school', compact('majors', 'classRooms', 'teachers', 'studyRooms', 'learningSubjects'));
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
            'class_room_id' => "required|int|min:1",
            'teacher_id' => "required|int|min:1",
            'learning_subject_id' => 'required|int|min:1'
        ]);

        $existingClassRoom = ClassRoom::findOrFail($validated["class_room_id"]);

        if (!$existingClassRoom) {
            return redirect()->back()->withErrors('Kelas tidak valid!', 'server');
        }

        $existingTeacher = User::where('id', $validated["teacher_id"])->where('role', "TEACHER")->firstOrFail();

        if (!$existingTeacher) {
            return redirect()->back()->withErrors('Guru tidak valid!', 'server');
        }

        $existingLearningSubject = LearningSubject::findOrFail($validated['learning_subject_id']);

        if (!$existingLearningSubject) {
            return redirect()->back()->withErrors('Mapel tidak valid!', 'server');
        }

        StudyRoom::create($validated);

        return redirect()->back();
    }
    public function updateStudyRoom($id, Request $request)
    {
        $validated = $request->validate([
            'class_room_id' => "int|min:1",
            'teacher_id' => "int|min:1",
            'learning_subject_id' => 'required|int|min:1'
        ]);

        $existingStudyRoom = StudyRoom::findOrFail($id);

        if (!$existingStudyRoom) {
            return redirect()->back()->withErrors('KBM tidak valid!', 'server');
        }

        $existingClassRoom = ClassRoom::findOrFail($validated["class_room_id"]);

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
        $studyRoom = StudyRoom::where('id', $id)->with([
            'classroom.major',
            'classroom.students',
            'teacher',
            'learning_subject'
            ])->first();
        if (!$studyRoom) {
            return redirect()->route('dashboard.admin.manage.school.index');
        }
        $studentList = User::where('role', 'STUDENT')->get();
        return Inertia::render('dashboard/admin/study-room-detail', compact('studyRoom', 'studentList'));
    }

    public function createLearningSubject(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|min:3',
                'type' => 'required|string',
            ]);

            $allowedLearningSubjectType = ['THEORY', 'PRACTICE'];

            if (!in_array($request['type'], $allowedLearningSubjectType)) {
                return redirect()->back()->withErrors('Mohon masukkan tipe mata pelajaran dengan benar!', 'server');
            }

            $existingLearningSubjectByUserInput = LearningSubject::where('name', $validated['name'])->where('type', $validated['type'])->first();

            if ($existingLearningSubjectByUserInput) {
                return redirect()->back()->withErrors('Mata Pelajaran ini bentrok dengan Mata Pelajaran sebelumnya!', 'server');
            }

            LearningSubject::create($validated);

            return redirect()->back();
        } catch (\Exception $e) {
            return redirect()->back()->withErrors($e->getMessage() || "Terjadi Kesalahan", 'server');
        }
    }

    public function updateLearningSubject($id, Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:3',
            'type' => 'required|string',
        ]);

        $allowedLearningSubjectType = ['THEORY', 'PRACTICE'];

        if (!in_array($request['type'], $allowedLearningSubjectType)) {
            return redirect()->back()->withErrors('Mohon masukkan tipe mata pelajaran dengan benar!', 'server');
        }

        $existingLearningSubjectByUserInput = LearningSubject::where('name', $validated['name'])->where('type', $validated['type'])->first();

        if ($existingLearningSubjectByUserInput && $existingLearningSubjectByUserInput->id != $id) {
            return redirect()->back()->withErrors('Mata Pelajaran ini bentrok dengan Mata Pelajaran sebelumnya!', 'server');
        }

        $existingLearningSubject = LearningSubject::findOrFail($id);

        if (!$existingLearningSubject) {
            return redirect()->back()->withErrors('Mata Pelajaran ini tidak valid!', 'server');
        }

        $existingLearningSubject->update($validated);

        return redirect()->back();
    }
    public function deleteLearningSubject($id)
    {
        $existingLearningSubject = LearningSubject::findOrFail($id)->first();

        if (!$existingLearningSubject) {
            return redirect()->back()->withErrors('Mata Pelajaran ini tidak valid!', 'server');
        }

        $existingLearningSubject->delete();

        return redirect()->back();
    }

    public function addStudentToTheClassroom($id, Request $request)
    {
        $validated = $request->validate([
            'user_id' => "required|int|min:1"
        ]);

        $existingClassRoom = ClassRoom::findOrFail($id);

        if (!$existingClassRoom) {
            return redirect()->back()->withErrors('Kelas tidak valid', 'server');
        }

        $existingStudent = User::where('role', 'STUDENT')->findOrFail($validated['user_id']);

        if (!$existingStudent) {
            return redirect()->back()->withErrors('Murid tidak valid', 'server');
        }
        
        if($existingStudent->class_room_id ==$existingClassRoom->id){
            return redirect()->back()->withErrors('Murid ini sudah terdaftar di kelas ini', 'server');

        }

        $existingStudent->update(['class_room_id' => $existingClassRoom->id]);

        return redirect()->back();
    }
    public function changeStudentInTheClassRoom($id, $userId, Request $request)
    {
        $validated = $request->validate([
            'user_id' => "required|int|min:1"
        ]);

        $existingClassRoom = StudyRoom::findOrFail($id);

        if (!$existingClassRoom) {
            return redirect()->back()->withErrors('Kelas tidak valid', 'server');
        }

        $existingRecentStudent = User::where('role', 'STUDENT')->where('class_room_id', $existingClassRoom->id)->findOrFail($userId);

        if (!$existingRecentStudent) {
            return redirect()->back()->withErrors('Murid tidak valid', 'server');
        }
        
        $existingNewStudent = User::where('role', 'STUDENT')->findOrFail($validated['user_id']);
        
        if ($existingRecentStudent->id ==$existingNewStudent->id) {
            return redirect()->back()->withErrors('Murid lama dan murid pengganti tidak boleh sama!', 'server');
        }
        if (!$existingNewStudent) {
            return redirect()->back()->withErrors('Murid pengganti tidak valid!', 'server');
        }
        
        if($existingNewStudent->class_room_id ==$existingClassRoom->id){
            return redirect()->back()->withErrors('Murid pengganti sudah terdaftar di kelas ini!', 'server');
        }

        $existingRecentStudent->update(['class_room_id' => null]);

        $existingNewStudent->update(['class_room_id' => $existingClassRoom->id]);

        return redirect()->back();
    }
    public function deleteStudentInTheClassRoom($id, $userId)
    {

        $existingClassRoom = ClassRoom::findOrFail($id);

        if (!$existingClassRoom) {
            return redirect()->back()->withErrors('Kelas tidak valid', 'server');
        }

        $existingStudent = User::where('role', 'STUDENT')->where('id', $userId)->where('class_room_id', $existingClassRoom->id)->first();

        if (!$existingStudent) {
            return redirect()->back()->withErrors('Murid tidak ada dalam kelas', 'server');
        }

        $existingStudent->update(['class_room_id' => null]);

        return redirect()->back();
    }

    public function showClassRoomDetail($id)
    {
        $classroom = ClassRoom::with(['major', 'students', 'studyRooms'])->findOrFail($id);
        $studentList = User::where('role', 'STUDENT')->get();
        return Inertia::render('dashboard/admin/class-room-detail', compact('classroom','studentList'));
    }

}

