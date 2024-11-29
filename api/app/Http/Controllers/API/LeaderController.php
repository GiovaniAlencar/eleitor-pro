<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class LeaderController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'leader')
            ->withCount('voters');

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

        $perPage = $request->get('per_page', 10);
        $leaders = $query->paginate($perPage);

        return response()->json([
            'data' => $leaders->items(),
            'meta' => [
                'current_page' => $leaders->currentPage(),
                'last_page' => $leaders->lastPage(),
                'per_page' => $leaders->perPage(),
                'total' => $leaders->total()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'whatsapp' => 'required|string',
            'zip_code' => 'required|string',
            'address' => 'required|string',
            'number' => 'required|string',
            'neighborhood' => 'required|string',
            'city' => 'required|string',
            'birth_date' => 'required|date',
            'marital_status' => 'required|string'
        ]);

        $validated['role'] = 'leader';
        $validated['password'] = Hash::make($validated['password']);
        $validated['status'] = 'active';

        $leader = User::create($validated);
        
        return response()->json([
            'message' => 'Liderança cadastrada com sucesso',
            'data' => $leader
        ], 201);
    }

    public function update(Request $request, User $leader)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($leader->id)],
            'whatsapp' => 'required|string',
            'zip_code' => 'required|string',
            'address' => 'required|string',
            'number' => 'required|string',
            'neighborhood' => 'required|string',
            'city' => 'required|string',
            'birth_date' => 'required|date',
            'marital_status' => 'required|string',
            'status' => 'sometimes|string|in:active,inactive'
        ]);

        if ($request->has('password')) {
            $validated['password'] = Hash::make($request->password);
        }

        $leader->update($validated);
        
        return response()->json([
            'message' => 'Liderança atualizada com sucesso',
            'data' => $leader
        ]);
    }

    public function destroy(User $leader)
    {
        $leader->delete();
        return response()->json(['message' => 'Liderança excluída com sucesso']);
    }

    public function profile(User $leader)
    {
        $birthDate = Carbon::parse($leader->birth_date);
        
        return response()->json([
            'id' => $leader->id,
            'name' => $leader->name,
            'email' => $leader->email,
            'whatsapp' => $leader->whatsapp,
            'role' => 'Liderança de Campanha',
            'age' => $birthDate->age,
            'children' => 2,
            'marital_status' => $leader->marital_status,
            'city' => $leader->city,
            'address' => $leader->address,
            'neighborhood' => $leader->neighborhood,
            'state' => 'São Paulo',
            'birth_date' => $leader->birth_date,
            'photo_url' => $leader->photo_url,
            'status' => $leader->status,
            'full_address' => "{$leader->address}, Nº{$leader->number}",
            'complete_city' => "{$leader->city} do Bom Jesus",
            'statistics' => [
                'voters_count' => $leader->voters()->count(),
                'meetings_count' => 15
            ]
        ]);
    }

    public function updatePhoto(Request $request, User $leader)
    {
        $request->validate([
            'photo' => 'required|image|max:2048'
        ]);

        if ($leader->photo_url) {
            Storage::disk('public')->delete($leader->photo_url);
        }

        $path = $request->file('photo')->store('leaders', 'public');
        $leader->update(['photo_url' => $path]);

        return response()->json([
            'message' => 'Foto atualizada com sucesso',
            'photo_url' => Storage::url($path)
        ]);
    }

    public function show(User $leader)
    {
        return response()->json([
            'data' => $leader->load('voters')
        ]);
    }
}