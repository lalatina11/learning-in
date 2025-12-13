<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{

    public function cannotLogin()
    {
        $user = request()->user();
        if ($user) {
            $role = $user->role;
            if ($role !== "ADMIN") {
                return redirect()->route("dashboard.admin");
            } else if ($role == "TEACHER") {
                return redirect()->route("dashboard.teacher");
            }
            return redirect()->route("dashboard.student");
        }
    }

    public function showAuthPage()
    {
        $this->cannotLogin();
        return Inertia::render('auth');
    }

    public function login(Request $request)
    {
        $this->cannotLogin();
        $validated = $request->validate([
            'identifier' => 'string|min:3',
            'password' => 'string|min:8'
        ]);
        $user = User::where('email', $validated['identifier'])->orWhere('name', $validated['identifier'])->first();
        if (!$user) {
            // return 
        }
    }
    public function register(Request $request)
    {
        $this->cannotLogin();
        $validated = $request->validate([
            'identifier' => 'string|min:3',
            'password' => 'string|min:8',
            'role' => 'required|in:TEACHER,STUDENT,ADMIN'
        ]);
        $user = User::where('email', $validated['identifier'])->orWhere('name', $validated['identifier'])->first();
        if (!$user) {
            // return 
        }
    }
}
