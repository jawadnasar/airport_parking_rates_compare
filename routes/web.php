<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Route::post('/api/login', [AuthController::class, 'login']);

Route::get('all_airport_parking_prices', [App\Http\Controllers\AllAirportParkingPrices::class, 'index']);
Route::post('all_airport_parking_prices/search_by_dates', [App\Http\Controllers\AllAirportParkingPrices::class, 'search_by_dates'])->name('all_airport_parking_prices.search_by_dates');
Route::post('all_airport_parking_prices/download_excel', [App\Http\Controllers\AllAirportParkingPrices::class, 'download_excel'])->name('all_airport_parking_prices.download_excel');;