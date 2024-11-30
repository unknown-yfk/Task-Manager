<?php
// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class SharedList extends Model
// {
//     use HasFactory;

//     protected $fillable = ['task_list_id', 'user_id', 'permission'];
// }


// class SharedList extends Model
// {
//     use HasFactory;

//     protected $fillable = ['task_list_id', 'user_id', 'permission'];

//     // Define the relationship with TaskList
//     public function taskList()
//     {
//         return $this->belongsTo(TaskList::class, 'task_list_id');
//     }

//     // Define the relationship with User
//     public function user()
//     {
//         return $this->belongsTo(User::class, 'user_id');
//     }
// }




namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\TaskList;  // Import TaskList model
use App\Models\User;      // Import User model

class SharedList extends Model
{
    use HasFactory;

    protected $fillable = ['task_list_id', 'user_id', 'permission'];

    // Define the relationship with TaskList
    public function taskList()
    {
        return $this->belongsTo(TaskList::class, 'task_list_id');
    }

    // Define the relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
