<?php

namespace App\Http\Controllers;

use App\Models\LearningModule;
use App\Models\StudyRoom;
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
        $studyRoom = StudyRoom::where('teacher_id', request()->user()->id)->with('classroom')->with('teacher')->with('students')->with('learning_subject')->with('learning_modules')->findOrFail($id);
        return Inertia::render("dashboard/teacher/learning/details", compact("studyRoom"));
    }

    public function createLearningModule($studyRoomid, Request $request)
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
            $storageUrl = $file->store("learning_modules", 'public');
            $url = asset(Storage::url($storageUrl));
            $validated['storage_url'] = $storageUrl;
            $validated['url'] = $url;
            LearningModule::create($validated);
            return redirect()->back();
        }
        return redirect()->back()->withErrors("Mohon upload module!", "server");

    }
    public function updateLearningModule($id, Request $request)
    {
        $validated = $request->validate([
            'description' => 'string|min:3'
        ]);

        $learningModule = LearningModule::findOrFail($id);

        if (!$learningModule) {
            return redirect()->back()->withErrors("Modul tidak ditemukan!", "server");
        }

        $allowedModuleMimeType = ['docx', 'pdf', 'pptx'];


        if ($request->hasFile("module")) {
            $file = $request->file("module");
            if (!in_array($file->getClientOriginalExtension(), $allowedModuleMimeType)) {
                return redirect()->back()->withErrors("Hanya bisa menerima file PPT, PDF, atau Word", "server");
            }
            Storage::disk('public')->delete($learningModule->storage_url);
            $file = $request->file("module");
            $storageUrl = $file->store("learning_modules", 'public');
            $url = asset(Storage::url($storageUrl));
            $validated['storage_url'] = $storageUrl;
            $validated['url'] = $url;
            $learningModule->update($validated);
            return redirect()->back();
        }

        $learningModule->update($validated);
        return redirect()->back();
    }
    public function deleteLearningModule($id)
    {
        $learningModule = LearningModule::findOrFail($id);


        $learningModule->delete();

        return redirect()->back();
    }
}
