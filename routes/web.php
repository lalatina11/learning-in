<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['guest.middleware'])->group(function () {
    Route::get('/login', [AuthController::class, 'showAuthPage'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
});

Route::middleware(['auth.middleware'])->group(function () {
    Route::prefix('/dashboard')->group(function () {
        Route::middleware(['admin.middleware'])->prefix('/admin')->group(function () {
            Route::get('/', [DashboardController::class, 'showAdminDashboard'])->name('dashboard.admin');
        });
        Route::middleware(['teacher.middleware'])->prefix('/teacher')->group(function () {
            Route::get('/', [DashboardController::class, 'showTeacherDashboard'])->name('dashboard.teacher');
        });
        Route::middleware(['student.middleware'])->group(function () {
            Route::get('/', [DashboardController::class, 'showStudentDashboard'])->name('dashboard.student');
        });
    });
    Route::delete('/logout', [AuthController::class, 'logout'])->name('logout');
});
