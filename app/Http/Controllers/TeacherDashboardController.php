<?php

namespace App\Http\Controllers;

use App\Models\StudyRoom;
use Illuminate\Http\Request;
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
        $studyRoom = StudyRoom::where('teacher_id', request()->user()->id)->with('classroom')->with('teacher')->with('students')->with('learning_subject')->findOrFail($id);
        if (!$studyRoom) {
            return redirect()->route('');
        }
        return Inertia::render("dashboard/teacher/learning/details", compact("studyRoom"));
    }
}
