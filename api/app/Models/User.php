<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'whatsapp',
        'zip_code',
        'address',
        'number',
        'neighborhood',
        'city',
        'birth_date',
        'marital_status',
        'status',
        'photo_url'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'birth_date' => 'date',
        'password' => 'hashed',
    ];

    protected $appends = ['photo_url_full'];

    public function getPhotoUrlFullAttribute()
    {
        return $this->photo_url ? Storage::url($this->photo_url) : null;
    }

    public function voters()
    {
        return $this->hasMany(Voter::class, 'leader_id');
    }
}