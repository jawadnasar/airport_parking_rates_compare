<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    //API login method
    public function login(Request $request)
    {
        // Validate the request data
        try {
            $credentials = $request->validate([
                'email'    => 'required|email',
                'password' => 'required|string',
                'device_name' => 'required|string|max:255',
            ]);
            $user = User::where('email', $request->email)->first();

            if (! $user || ! Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['The provided credentials are incorrect.'],
                ]);
            }

            return response()->json([
                'user'  => $user->email,
                'token' => $user->createToken($request->device_name)->plainTextToken,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        }
    }
}
