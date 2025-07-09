<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CompareAllWebsitesPricesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Login for API User
Route::post('/login', [AuthController::class, 'login']);

// Compare all websites prices
Route::apiResource('update_websites_prices', CompareAllWebsitesPricesController::class);