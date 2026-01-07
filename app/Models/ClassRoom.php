<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassRoom extends Model
{
    use HasFactory;
    protected $fillable = ['grade', 'major_id'];

    protected $casts = ['grade' => 'string'];

    public function major()
    {
        return $this->belongsTo(Major::class, 'major_id');
    }

    public function studyRooms()
    {
        return $this->hasMany(StudyRoom::class);
    }

    public function students()
    {
        return $this->hasMany(User::class);
    }

    public function studentsCount()
    {
        return $this->students()->count();
    }
}
