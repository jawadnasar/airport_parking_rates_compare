<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RateScraperController;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/get_all_prices', [RateScraperController::class, 'all_websites_prices'])->name('get_all_prices');// This route will call the all_websites_prices method in RateScraperController