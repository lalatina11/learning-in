<?php

namespace App\Http\Controllers;

use App\Models\QuizRating;
use App\Models\StudyRoom;
use App\Models\StudyRoomModule;
use App\Models\StudyRoomQuizzez;
use App\Models\StudyRoomTask;
use App\Models\StudyRoomTaskSubmission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TeacherDashboardController extends Controller
{
    public function showDashboard()
    {
        return Inertia::render("dashboard/teacher/index", );
    }
    public function showLearningDashboard()
    {
        $studyRooms = StudyRoom::where('teacher_id', request()->user()->id)->with(['classroom.major', 'teacher', 'learning_subject'])->get();
        return Inertia::render("dashboard/teacher/learning/index", compact("studyRooms"));
    }
    public function showLearningDashboardDetails($id)
    {
        $studyRoom = StudyRoom::where('teacher_id', request()->user()->id)->with(['classroom.major', 'classroom.students', 'teacher', 'learning_subject', 'modules', 'tasks.taskSubmissions.student', 'quizzes.ratings.student'])->findOrFail($id);
        return Inertia::render("dashboard/teacher/learning/details", compact("studyRoom"));
    }

    public function createStudyRoomModule($studyRoomid, Request $request)
    {
        $validated = $request->validate([
            'description' => 'string|min:3'
        ]);

        $studyRoom = StudyRoom::findOrFail($studyRoomid);

        if (!$studyRoom) {
            return redirect()->back()->withErrors("KBM tidak valid!", "server");
        }

        $validated['study_room_id'] = $studyRoom->id;

        $allowedModuleMimeType = ['docx', 'pdf', 'pptx'];

        if ($request->hasFile("module")) {
            $file = $request->file("module");
            if (!in_array($file->getClientOriginalExtension(), $allowedModuleMimeType)) {
                return redirect()->back()->withErrors("Hanya bisa menerima file PPT, PDF, atau Word", "server");
            }
            $storageUrl = $file->store("study_room_modules", 'public');
            $url = asset(Storage::url($storageUrl));
            $validated['storage_url'] = $storageUrl;
            $validated['url'] = $url;
            StudyRoomModule::create($validated);
            return redirect()->back();
        }
        return redirect()->back()->withErrors("Mohon upload module!", "server");

    }
    public function updateStudyRoomModule($id, Request $request)
    {
        $validated = $request->validate([
            'description' => 'string|min:3'
        ]);

        $studyRoomModule = StudyRoomModule::findOrFail($id);

        if (!$studyRoomModule) {
            return redirect()->back()->withErrors("Modul tidak ditemukan!", "server");
        }

        $allowedModuleMimeType = ['docx', 'pdf', 'pptx'];


        if ($request->hasFile("module")) {
            $file = $request->file("module");
            if (!in_array($file->getClientOriginalExtension(), $allowedModuleMimeType)) {
                return redirect()->back()->withErrors("Hanya bisa menerima file PPT, PDF, atau Word", "server");
            }
            Storage::disk('public')->delete($studyRoomModule->storage_url);
            $file = $request->file("module");
            $storageUrl = $file->store("study_room_modules", 'public');
            $url = asset(Storage::url($storageUrl));
            $validated['storage_url'] = $storageUrl;
            $validated['url'] = $url;
            $studyRoomModule->update($validated);
            return redirect()->back();
        }

        $studyRoomModule->update($validated);
        return redirect()->back();
    }
    public function deleteStudyRoomModule($id)
    {
        $studyRoomModule = StudyRoomModule::findOrFail($id);

        if (!$studyRoomModule) {
            return redirect()->back()->withErrors("Module tidak ditemukan!", "server");
        }


        Storage::disk('public')->delete($studyRoomModule->storage_url);

        $studyRoomModule->delete();

        return redirect()->back();
    }

    public function createStudyRoomTask($studyRoomid, Request $request)
    {
        $validated = $request->validate([
            'description' => 'string|min:3'
        ]);

        $studyRoom = StudyRoom::findOrFail($studyRoomid);

        if (!$studyRoom) {
            return redirect()->back()->withErrors("KBM tidak valid!", "server");
        }

        $validated['study_room_id'] = $studyRoom->id;

        $allowedModuleMimeType = ['docx', 'pdf'];

        if ($request->hasFile("task")) {
            $file = $request->file("task");
            if (!in_array($file->getClientOriginalExtension(), $allowedModuleMimeType)) {
                return redirect()->back()->withErrors("Hanya bisa menerima file PDF, atau Word", "server");
            }
            $storageUrl = $file->store("study_room_tasks", 'public');
            $url = asset(Storage::url($storageUrl));
            $validated['storage_url'] = $storageUrl;
            $validated['url'] = $url;
            StudyRoomTask::create($validated);
            return redirect()->back();
        }
        return redirect()->back()->withErrors("Mohon upload module!", "server");

    }
    public function updateStudyRoomTask($id, Request $request)
    {
        $validated = $request->validate([
            'description' => 'string|min:3'
        ]);

        $studyRoomTask = StudyRoomTask::findOrFail($id);

        if (!$studyRoomTask) {
            return redirect()->back()->withErrors("Task tidak ditemukan!", "server");
        }

        $allowedModuleMimeType = ['docx', 'pdf'];


        if ($request->hasFile("task")) {
            $file = $request->file("task");
            if (!in_array($file->getClientOriginalExtension(), $allowedModuleMimeType)) {
                return redirect()->back()->withErrors("Hanya bisa menerima file PDF, atau Word", "server");
            }
            Storage::disk('public')->delete($studyRoomTask->storage_url);
            $storageUrl = $file->store("study_room_tasks", 'public');
            $url = asset(Storage::url($storageUrl));
            $validated['storage_url'] = $storageUrl;
            $validated['url'] = $url;
            $studyRoomTask->update($validated);
            return redirect()->back();
        }

        $studyRoomTask->update($validated);
        return redirect()->back();
    }
    public function deleteStudyRoomTask($id)
    {
        $studyRoomTask = StudyRoomTask::findOrFail($id);

        if (!$studyRoomTask) {
            return redirect()->back()->withErrors("Task tidak ditemukan!", "server");
        }


        Storage::disk('public')->delete($studyRoomTask->storage_url);

        $studyRoomTask->delete();

        return redirect()->back();
    }

    public function switchStudyRoomTaskStatus($id)
    {
        $studyRoomTask = StudyRoomTask::findOrFail($id);


        $studyRoomTask->update(['is_closed' => !$studyRoomTask->is_closed]);

        return redirect()->back();
    }

    public function ratingTaskSubmission($id, Request $request)
    {
        $validated = $request->validate([
            'rate' => 'integer|min:0',
            'teacher_note' => 'string|nullable'
        ]);
        $studyRoomTaskSubmission = StudyRoomTaskSubmission::findOrFail($id);
        if (!$studyRoomTaskSubmission) {
            return redirect()->back()->withErrors("Pekerjaan Tugas tidak valid", 'server');
        }
        if (!$validated['teacher_note']) {
            $validated['teacher_note'] = $studyRoomTaskSubmission->teacher_note || "";
        }
        $validated['is_rated'] = true;
        $studyRoomTaskSubmission->update($validated);
        return redirect()->back();
    }

    public function createQuiz($studyRoomId, Request $request)
    {
        $validated = $request->validate([
            'platform' => ['string', 'min:1'],
            'join_code' => ['string', 'min:1'],
        ]);

        $studyRoom = StudyRoom::findOrFail($studyRoomId);
        if (!$studyRoom) {
            return redirect()->back()->withErrors('KBM Tidak valid', 'server');
        }
        $quiz = StudyRoomQuizzez::create([
            'study_room_id' => $studyRoom->id,
            'platform' => $validated['platform'],
            'join_code' => $validated['join_code'],
        ])->first();

        $students = User::where('role', "STUDENT")->where('class_room_id', $studyRoom->class_room_id)->get();
        foreach ($students as $student) {
            QuizRating::create([
                'student_id' => $student->id,
                'quiz_id' => $quiz->id,
            ]);
        }
        return redirect()->back();
    }
    public function updateQuiz($id, Request $request)
    {
        $validated = $request->validate([
            'platform' => ['nullable', 'string', 'min:1'],
            'join_code' => ['nullable', 'string', 'min:1'],
        ]);

        $quiz = StudyRoomQuizzez::findOrFail($id);
        if (!$quiz) {
            return redirect()->back()->withErrors('Quiz Tidak valid', 'server');
        }
        $quiz->update([
            'platform' => $validated['platform'] ?? $quiz->platform,
            'join_code' => $validated['join_code'] ?? $quiz->join_code,
        ]);

        return redirect()->back();
    }
    public function deleteQuiz($id)
    {
        $quiz = StudyRoomQuizzez::findOrFail($id);
        if (!$quiz) {
            return redirect()->back()->withErrors('Quiz Tidak valid', 'server');
        }
        $quiz->delete();

        return redirect()->back();
    }
    public function switchQuizStatus($id)
    {
        $quiz = StudyRoomQuizzez::findOrFail($id);
        if (!$quiz) {
            return redirect()->back()->withErrors('Quiz Tidak valid', 'server');
        }
        $quiz->update(['is_open' => !$quiz->is_open]);

        return redirect()->back();
    }
    public function quizRatingForStudent($id, $studentId, Request $request)
    {
        $validated = $request->validate([
            'rate' => ['integer'],
            'teacher_note' => ['nullable', 'string'],
        ]);

        $quizRating = QuizRating::where('student_id', $studentId)->findOrFail($id);

        if (!$quizRating) {
            return redirect()->back()->withErrors('Quiz Tidak valid', 'server');
        }

        if (!$quizRating->is_rated) {
            $quizRating->update([
                'is_rated' => true,
            ]);
        }

        $quizRating->update([
            'rate' => $validated['rate'],
            'teacher_note' => $validated['teacher_note'] ?? $quizRating->teacher_note,
        ]);

        return redirect()->back();
    }
}
