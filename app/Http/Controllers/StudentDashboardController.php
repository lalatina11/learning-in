<?php

namespace App\Http\Controllers;

use App\Models\StudyRoom;
use App\Models\StudyRoomTask;
use App\Models\StudyRoomTaskSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentDashboardController extends Controller
{
    public function showStudentDashboard()
    {
        return Inertia::render("dashboard/student/index", );
    }
    public function showStudentLearningDashboard()
    {
        $studyRooms = request()->user()->studyRooms()->with(['classroom.major', 'teacher', 'learning_subject'])->get();
        return Inertia::render("dashboard/student/learning/index", compact('studyRooms'));
    }
    public function showStudentLearningDashboardDetails($id)
    {
        $studentId = request()->user()->id;

        $studyRoom = StudyRoom::with([
            'classroom',
            'teacher',
            'learning_subject',
            'modules',
            'tasks' => function ($query) use ($studentId) {
                $query->with([
                    'taskSubmissions' => function ($q) use ($studentId) {
                        $q->where('student_id', $studentId);
                    }
                ]);
            }
        ])->findOrFail($id);

        $studentIds = $studyRoom->students->pluck('id')->toArray();
        $isStudentInTheStudyRoom = in_array(request()->user()->id, $studentIds);

        if (!$isStudentInTheStudyRoom) {
            return redirect()->route('dashboard.student.learning.index');
        }
        return Inertia::render("dashboard/student/learning/details", compact('studyRoom'));
    }

    public function taskSubmission($id, Request $request)
    {

        $validate = $request->validate([
            'url' => 'required|string|min:5'
        ]);

        $user = $request->user();

        if (!$user) {
            return redirect()->back()->withErrors("Anda harus login sebagai siswa terlebi dahulu", "sever");

        }
        if ($user->role !== "STUDENT") {
            return redirect()->back()->withErrors("Hanya siswa yang bisa melakukan submit tugas!", "sever");
        }

        $existingTask = StudyRoomTask::findOrFail($id);

        if (!$existingTask) {
            return redirect()->back()->withErrors("Data penugasan tidak valid!", "sever");
        }

        $existingTaskSubmission = StudyRoomTaskSubmission::where('task_id', $existingTask->id)->where('student_id', $user->id)->first();

        if (!$existingTaskSubmission) {
            StudyRoomTaskSubmission::create([
                'student_id' => $user->id,
                'task_id' => $existingTask->id,
                'url' => $validate['url'],
            ]);
        } else {
            $existingTaskSubmission->update(['url' => $validate['url']]);
        }
        return redirect()->back();
    }

}
