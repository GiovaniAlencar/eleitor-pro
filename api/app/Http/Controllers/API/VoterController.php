<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Voter;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VoterController extends Controller
{
    public function index(Request $request)
    {
        $query = Voter::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('city')) {
            $query->where('city', $request->city);
        }

        if ($request->has('leader_id')) {
            $query->where('leader_id', $request->leader_id);
        }

        $perPage = $request->get('per_page', 10);
        $voters = $query->paginate($perPage);

        return response()->json([
            'data' => $voters->items(),
            'meta' => [
                'current_page' => $voters->currentPage(),
                'last_page' => $voters->lastPage(),
                'per_page' => $voters->perPage(),
                'total' => $voters->total()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:voters',
            'whatsapp' => 'required|string',
            'zip_code' => 'required|string',
            'address' => 'required|string',
            'number' => 'required|string',
            'neighborhood' => 'required|string',
            'city' => 'required|string',
            'birth_date' => 'required|date',
            'marital_status' => 'required|string',
            'leader_id' => 'nullable|exists:users,id',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric'
        ]);

        $validated['status'] = 'active';
        $voter = Voter::create($validated);
        
        return response()->json([
            'message' => 'Eleitor cadastrado com sucesso',
            'data' => $voter
        ], 201);
    }

    public function show(Voter $voter)
    {
        return response()->json([
            'data' => $voter->load('leader')
        ]);
    }

    public function update(Request $request, Voter $voter)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('voters')->ignore($voter->id)],
            'whatsapp' => 'required|string',
            'zip_code' => 'required|string',
            'address' => 'required|string',
            'number' => 'required|string',
            'neighborhood' => 'required|string',
            'city' => 'required|string',
            'birth_date' => 'required|date',
            'marital_status' => 'required|string',
            'leader_id' => 'nullable|exists:users,id',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'status' => 'sometimes|string|in:active,inactive'
        ]);

        $voter->update($validated);
        
        return response()->json([
            'message' => 'Eleitor atualizado com sucesso',
            'data' => $voter
        ]);
    }

    public function destroy(Voter $voter)
    {
        $voter->delete();
        return response()->json(['message' => 'Eleitor excluído com sucesso']);
    }

    public function stats()
    {
        $stats = [
            'total' => Voter::count(),
            'active' => Voter::where('status', 'active')->count(),
            'inactive' => Voter::where('status', 'inactive')->count(),
            'cities' => Voter::distinct('city')->count('city')
        ];

        return response()->json($stats);
    }

    public function export()
    {
        $voters = Voter::with('leader')->get()->map(function ($voter) {
            return [
                'Nome' => $voter->name,
                'Email' => $voter->email,
                'Whatsapp' => $voter->whatsapp,
                'Cidade' => $voter->city,
                'Bairro' => $voter->neighborhood,
                'Status' => $voter->status === 'active' ? 'Ativo' : 'Inativo',
                'Liderança' => $voter->leader ? $voter->leader->name : 'Sem liderança'
            ];
        });

        return response()->json($voters);
    }
}