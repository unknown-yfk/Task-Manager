<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskListController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SharedTaskListController;

/*
|---------------------------------------------------------------------------|
| API Routes                                                                |
|---------------------------------------------------------------------------|
*/

// Authentication Routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Protected Routes (requires authentication)
Route::middleware('auth:sanctum')->group(function () {
    // View Task Lists Shared With You
    Route::get('task-lists/shared-with-me', [SharedTaskListController::class, 'sharedWithMe']);
    
    // Task Lists Routes
    Route::resource('task-lists', TaskListController::class);

    // Tasks Routes (nested under task lists)
    Route::resource('task-lists.tasks', TaskController::class);

    // Sharing Task Lists
    Route::post('task-lists/{taskListId}/share', [SharedTaskListController::class, 'share']);

    // List users shared on a task list
    Route::get('task-lists/{taskListId}/shared', [SharedTaskListController::class, 'listSharedUsers']);

    // Update permission for shared task list
    Route::put('task-lists/{taskListId}/shared/{userId}', [SharedTaskListController::class, 'updatePermission']);

    // Revoke access for a shared task list
    Route::delete('task-lists/{taskListId}/shared/{userId}', [SharedTaskListController::class, 'revokeAccess']);

    // Optionally, add user information route
    Route::get('user', function (Request $request) {
        return $request->user();
    });
});
