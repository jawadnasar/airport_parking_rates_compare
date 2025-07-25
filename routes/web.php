<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Route::post('/api/login', [AuthController::class, 'login']);

Route::get('all_ariport_parking_prices', [App\Http\Controllers\API\CompareAllWebsitesPricesController::class, 'index']);