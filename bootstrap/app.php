<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\AuthMiddleware;
use App\Http\Middleware\CustomAuthMiddleware;
use App\Http\Middleware\GuestOnlyMiddleware;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\StudentMiddleware;
use App\Http\Middleware\TeacherMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->alias([
            'auth.middleware' => AuthMiddleware::class,
            'guest.middleware' => GuestOnlyMiddleware::class,
            'admin.middleware' => AdminMiddleware::class,
            'teacher.middleware' => TeacherMiddleware::class,
            'student.middleware' => StudentMiddleware::class,
        ]);
        $middleware->encryptCookies(['sidebar_state']);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
