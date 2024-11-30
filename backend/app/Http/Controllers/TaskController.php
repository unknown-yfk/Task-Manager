<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Create task
    public function store(Request $request, $taskListId)
    {
        $taskList = TaskList::findOrFail($taskListId);

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $task = $taskList->tasks()->create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json($task, 201);
    }

    // Get tasks for a task list
    public function index($taskListId)
    {
        $taskList = TaskList::findOrFail($taskListId);
        $tasks = $taskList->tasks;
        return response()->json($tasks);
    }

    // Update task
    public function update(Request $request, $taskListId, $taskId)
    {
        $task = Task::where('task_list_id', $taskListId)->findOrFail($taskId);

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $task->update([
            'name' => $request->name,
            'description' => $request->description,
            'completed' => $request->completed,
        ]);

        return response()->json($task);
    }

    // Delete task
    public function destroy($taskListId, $taskId)
    {
        $task = Task::where('task_list_id', $taskListId)->findOrFail($taskId);
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
