<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
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
            "role" => "required|string|in:ADMIN,TEACHER,STUDENT",
        ]);

        $existingMasterNumber = User::where("master_number",  $validated['master_number'])->first();

        if ($existingMasterNumber) {
            return redirect()->back()->withErrors("NIM/NIK sudah digunakan, tolong ganti", "server");
        }
        $existingEmail = User::where("email",  $validated['email'])->first();

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
        ]);

        $user = User::findOrFail($id);

        if (!$user) {
            return redirect()->back()->withErrors("Pengguna tidak valid", "server");
        }

        $existingMasterNumber = User::where("master_number",  $validated['master_number'])->first();

        if ($existingMasterNumber && ($existingMasterNumber->id != $id)) {
            return redirect()->back()->withErrors("NIM/NIK sudah digunakan, tolong ganti", "server");
        }

        $existingEmail = User::where("email",   $validated['email'])->first();

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
        $user->delete();
        return redirect()->back();
    }
}
