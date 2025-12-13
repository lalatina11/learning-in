<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        // if ($redirect = $this->cannotLogin()) {
        //     return $redirect;
        // }
        return Inertia::render('auth',);
    }

    public function login(Request $request)
    {

        // if ($redirect = $this->cannotLogin()) {
        //     return $redirect;
        // }
        $validated = $request->validate([
            'master_number' => 'string|min:8|max:16',
            'password' => 'string|min:8'
        ]);
        $user = User::where('master_number', $validated['master_number'])->first();
        if (!$user) {
            return redirect()->back()->withErrors("Pengguna tidak terdaftar", 'server');
        }
        $token = Auth::attempt($validated);
        if (!$token) {
            return redirect()->back()->withErrors("Password tidak valid", 'server');
        }
        if ($user->role === "ADMIN") {
            return redirect()->route('dashboard.admin');
        }
        if ($user->role === "TEACHER") {
            return redirect()->route('dashboard.teacher');
        }
        return redirect()->route('dashboard.student');
    }
    public function register(Request $request)
    {
        // $this->cannotLogin();
        $validated = $request->validate([
            'identifier' => 'string|min:3',
            'password' => 'string|min:8',
            'role' => 'required|in:TEACHER,STUDENT,ADMIN'
        ]);
    }
}
