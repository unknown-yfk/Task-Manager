<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'completed', 'task_list_id',
    ];

    // Relationship with TaskList (many to one)
    public function taskList()
    {
        return $this->belongsTo(TaskList::class);
    }
}
