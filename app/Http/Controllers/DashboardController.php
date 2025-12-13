<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function showAdminDashboard()
    {
        return Inertia::render("dashboard/admin/index",);
    }
    public function showTeacherDashboard()
    {
        return Inertia::render("dashboard/teacher/index",);
    }
    public function showStudentDashboard()
    {
        return Inertia::render("dashboard/index",);
    }
}
