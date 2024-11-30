<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskList extends Model
{
    use HasFactory;

    // Define the fillable properties
    protected $fillable = [
        'name', 'description', 'user_id',
    ];

    // Define the relationship with the tasks (one to many)
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    // Define the relationship with the user (many to one)
    public function owner()
    {
        return $this->belongsTo(User::class);
    }




public function sharedUsers()
{
    return $this->belongsToMany(User::class, 'shared_lists', 'task_list_id', 'user_id')
                ->withPivot('permission')
                ->withTimestamps();
}


}
