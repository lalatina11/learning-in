<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudentDashboardController;
use App\Http\Controllers\TeacherDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['guest.middleware'])->group(function () {
    Route::get('/login', [AuthController::class, 'showAuthPage'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.handle');
});

Route::middleware(['auth.middleware'])->group(function () {
    Route::prefix('/dashboard')->group(function () {
        Route::middleware(['admin.middleware'])->prefix('/admin')->group(function () {
            Route::get('/', [AdminDashboardController::class, 'showAdminDashboard'])->name('dashboard.admin');
            Route::prefix('/user')->group(function () {
                Route::get('/', [AdminDashboardController::class, 'showManageUserDashboard'])->name('dashboard.admin.manage.user');
                Route::post('', [AdminDashboardController::class, 'createUser'])->name('dashboard.admin.manage.create.user');
                Route::patch('/{id}', [AdminDashboardController::class, 'updateUser'])->name('dashboard.admin.manage.update.user');
                Route::delete('/{id}', [AdminDashboardController::class, 'deleteUser'])->name('dashboard.admin.manage.delete.user');
            });
            Route::prefix('/school')->group(function () {
                Route::get('/', [AdminDashboardController::class, 'showSchoolManagementDashboard'])->name('dashboard.admin.manage.school.index');
                Route::prefix('/majors')->group(function () {
                    Route::post('/', [AdminDashboardController::class, 'createMajor'])->name('dashboard.admin.manage.school.create.major');
                    Route::patch('/{id}', [AdminDashboardController::class, 'updateMajor'])->name('dashboard.admin.manage.school.update.major');
                    Route::delete('/{id}', [AdminDashboardController::class, 'deleteMajor'])->name('dashboard.admin.manage.school.delete.major');
                });
            });
        });
        Route::middleware(['teacher.middleware'])->prefix('/teacher')->group(function () {
            Route::get('/', [TeacherDashboardController::class, 'showTeacherDashboard'])->name('dashboard.teacher');
        });
        Route::middleware(['student.middleware'])->group(function () {
            Route::get('/', [StudentDashboardController::class, 'showStudentDashboard'])->name('dashboard.student');
        });
    });
    Route::delete('/logout', [AuthController::class, 'logout'])->name('logout');
});
