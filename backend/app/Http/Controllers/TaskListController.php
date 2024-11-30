<?php

namespace App\Http\Controllers;

use App\Models\TaskList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskListController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Create task list
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $taskList = TaskList::create([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => Auth::id(),
        ]);

        return response()->json($taskList, 201);
    }

    // Get all task lists for authenticated user
    public function index()
    {
        $taskLists = TaskList::where('user_id', Auth::id())->get();
        return response()->json($taskLists);
    }

    // Get a specific task list
    public function show($id)
    {
        $taskList = TaskList::findOrFail($id);
        return response()->json($taskList);
    }

    // Update a task list
    public function update(Request $request, $id)
    {
        $taskList = TaskList::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $taskList->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json($taskList);
    }




    // Laravel controller method for sharing task lists
public function shareTaskList(Request $request, $taskListId)
{
    $validated = $request->validate([
        'username' => 'required|string|exists:users,username',
        'permission' => 'required|in:view_only,edit',
    ]);

    $user = User::where('username', $validated['username'])->first();
    $taskList = TaskList::findOrFail($taskListId);

    // Check if the user has permission to share
    if ($taskList->user_id !== auth()->id()) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    // Share the task list with the user
    $taskList->sharedUsers()->attach($user->id, [
        'permission' => $validated['permission'],
    ]);

    return response()->json(['message' => 'Task list shared successfully']);
}











    // Delete a task list
    public function destroy($id)
    {
        $taskList = TaskList::findOrFail($id);
        $taskList->delete();

        return response()->json(['message' => 'Task list deleted successfully']);
    }
}
