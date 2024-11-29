<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Voter;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $stats = [
            'total_eleitores' => Voter::count(),
            'total_liderancas' => User::where('role', 'leader')->count(),
            'total_cidades' => Voter::distinct('city')->count('city')
        ];

        return response()->json($stats);
    }

    public function growth(Request $request)
    {
        $period = $request->get('period', 'month');
        $endDate = Carbon::now();
        $startDate = match ($period) {
            'week' => Carbon::now()->subWeek(),
            'year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonth()
        };

        $data = [];
        $currentDate = $startDate->copy();

        while ($currentDate <= $endDate) {
            $data[] = [
                'date' => $currentDate->format('Y-m-d'),
                'eleitores' => Voter::whereDate('created_at', '<=', $currentDate)->count(),
                'liderancas' => User::where('role', 'leader')
                    ->whereDate('created_at', '<=', $currentDate)
                    ->count(),
                'cidades' => Voter::whereDate('created_at', '<=', $currentDate)
                    ->distinct('city')
                    ->count('city')
            ];

            $currentDate->addDay();
        }

        return response()->json($data);
    }
}