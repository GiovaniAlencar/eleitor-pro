<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voter extends Model
{
    protected $fillable = [
        'name',
        'email',
        'whatsapp',
        'zip_code',
        'address',
        'number',
        'neighborhood',
        'city',
        'birth_date',
        'marital_status',
        'status',
        'leader_id',
        'latitude',
        'longitude'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'latitude' => 'float',
        'longitude' => 'float'
    ];

    public function leader()
    {
        return $this->belongsTo(User::class, 'leader_id');
    }
}