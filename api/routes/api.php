<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\LeaderController;
use App\Http\Controllers\API\VoterController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\MapController;
use App\Http\Controllers\API\NotificationController;
use Illuminate\Support\Facades\Route;

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Leaders
    Route::apiResource('leaders', LeaderController::class);
    Route::get('/leaders/{leader}/profile', [LeaderController::class, 'profile']);
    Route::post('/leaders/{leader}/photo', [LeaderController::class, 'updatePhoto']);
    Route::get('/leaders/export', [LeaderController::class, 'export']);
    
    // Voters
    Route::apiResource('voters', VoterController::class);
    Route::get('/voters/stats', [VoterController::class, 'stats']);
    Route::get('/voters/export', [VoterController::class, 'export']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/growth', [DashboardController::class, 'growth']);

    // Map
    Route::get('/map/stats', [MapController::class, 'stats']);
    Route::get('/map/markers', [MapController::class, 'markers']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
});