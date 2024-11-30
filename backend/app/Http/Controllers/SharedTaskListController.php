<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TaskList;
use App\Models\SharedList;
use App\Models\User;

class SharedTaskListController extends Controller
{
  
    public function share(Request $request, $taskListId)
    {
        // Validate input
        $validated = $request->validate([
            'username' => 'required|string|exists:users,username',
            'permission' => 'required|string|in:view,edit',
        ]);
    
        // Find the task list
        $taskList = TaskList::findOrFail($taskListId);
    
        // Get the user by username
        $user = User::where('username', $validated['username'])->firstOrFail();
    
        // Share logic here
        try {
            // Save the sharing info to the database
            SharedList::create([
                'task_list_id' => $taskList->id,
                'user_id' => $user->id, // Use user_id here instead of username
                'permission' => $validated['permission'],
            ]);
    
            return response()->json(['message' => 'Task list shared successfully.']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to share task list.'], 500);
        }
    }
    
    public function sharedWithMe(Request $request)
{
    // Get the authenticated user
    $user = $request->user();

    // Fetch shared task lists with eager loading
    $sharedTaskLists = SharedList::where('user_id', $user->id)
        ->with(['taskList', 'user'])  // Eager load both task list and user
        ->get();

    return response()->json([
        'status' => 'success',
        'data' => $sharedTaskLists,
    ], 200);
}

    
    

    public function listSharedUsers(TaskList $taskList)
    {
        // Authorize that the user can view the task list
        $this->authorize('view', $taskList);

        return $taskList->sharedUsers()->withPivot('permission')->get();
    }

    public function updatePermission(Request $request, TaskList $taskList, User $user)
    {
        // Authorize that the user can share the task list (update permissions is part of sharing)
        $this->authorize('share', $taskList);

        $request->validate(['permission' => 'required|in:view,edit']);
        $taskList->sharedUsers()->updateExistingPivot($user->id, ['permission' => $request->permission]);

        return response()->json(['message' => 'Permission updated successfully.']);
    }

    public function revokeAccess(TaskList $taskList, User $user)
    {
        // Authorize that the user can share the task list (revoke access is part of sharing)
        $this->authorize('share', $taskList);

        $taskList->sharedUsers()->detach($user->id);
        return response()->json(['message' => 'Access revoked successfully.']);
    }
}
