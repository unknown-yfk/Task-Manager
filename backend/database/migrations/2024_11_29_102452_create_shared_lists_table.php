<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shared_lists', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('task_list_id');
            $table->unsignedBigInteger('user_id');
            $table->enum('permission', ['view', 'edit']); // Permissions for sharing
            $table->timestamps();
    
            // Foreign keys
            $table->foreign('task_list_id')->references('id')->on('task_lists')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shared_lists');
    }
};
