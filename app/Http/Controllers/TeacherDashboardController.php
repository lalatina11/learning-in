<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherDashboardController extends Controller
{
    public function showTeacherDashboard()
    {
        return Inertia::render("dashboard/teacher/index",);
    }
}
