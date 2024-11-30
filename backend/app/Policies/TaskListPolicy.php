<?php

namespace App\Policies;

use App\Models\TaskList;
use App\Models\User;

class TaskListPolicy
{
    /**
     * Determine if the given task list can be viewed by the user.
     */
    public function view(User $user, TaskList $taskList): bool
    {
        // Allow if the user owns the task list or has 'view' permission
        return $taskList->user_id === $user->id ||
            $taskList->sharedUsers()->where('user_id', $user->id)->where('permission', 'view')->exists();
    }

    /**
     * Determine if the given task list can be edited by the user.
     */
    public function edit(User $user, TaskList $taskList): bool
    {
        // Allow if the user owns the task list or has 'edit' permission
        return $taskList->user_id === $user->id ||
            $taskList->sharedUsers()->where('user_id', $user->id)->where('permission', 'edit')->exists();
    }

    /**
     * Determine if the user can delete the task list.
     */
    public function delete(User $user, TaskList $taskList): bool
    {
        // Only the owner can delete the task list
        return $taskList->user_id === $user->id;
    }

    /**
     * Determine if the user can share the task list.
     */
    public function share(User $user, TaskList $taskList): bool
    {
        // Only the owner can share the task list
        return $taskList->user_id === $user->id;
    }
}
