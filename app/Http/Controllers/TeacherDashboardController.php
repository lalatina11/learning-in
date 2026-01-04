<?php

namespace App\Http\Controllers;

use App\Models\StudyRoom;
use App\Models\StudyRoomModule;
use App\Models\StudyRoomTask;
use App\Models\StudyRoomTaskSubmission;
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
        $studyRooms = StudyRoom::where('teacher_id', request()->user()->id)->with('classroom')->with('learning_subject')->get();
        return Inertia::render("dashboard/teacher/learning/index", compact("studyRooms"));
    }
    public function showLearningDashboardDetails($id)
    {
        $studyRoom = StudyRoom::where('teacher_id', request()->user()->id)->with(['classroom', 'teacher', 'students', 'learning_subject', 'modules', 'tasks.taskSubmissions.student'])->findOrFail($id);
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
}
