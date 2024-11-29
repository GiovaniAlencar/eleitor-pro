<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Voter;
use Illuminate\Http\Request;

class MapController extends Controller
{
    public function stats()
    {
        $stats = [
            'total_voters' => Voter::count(),
            'gender_stats' => [
                'male' => Voter::where('gender', 'male')->count(),
                'female' => Voter::where('gender', 'female')->count()
            ],
            'city_stats' => Voter::select('city')
                ->selectRaw('count(*) as count')
                ->groupBy('city')
                ->get()
        ];

        return response()->json($stats);
    }

    public function markers(Request $request)
    {
        $query = collect();

        if ($request->type !== 'leader') {
            $voters = Voter::select('id', 'name', 'city', 'latitude', 'longitude')
                ->when($request->city, fn($q) => $q->where('city', $request->city))
                ->get()
                ->map(fn($voter) => [
                    ...$voter->toArray(),
                    'type' => 'voter'
                ]);
            $query = $query->concat($voters);
        }

        if ($request->type !== 'voter') {
            $leaders = User::where('role', 'leader')
                ->select('id', 'name', 'city', 'latitude', 'longitude')
                ->when($request->city, fn($q) => $q->where('city', $request->city))
                ->get()
                ->map(fn($leader) => [
                    ...$leader->toArray(),
                    'type' => 'leader'
                ]);
            $query = $query->concat($leaders);
        }

        return response()->json($query->values());
    }
}