<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AllAirportParkingPrices extends Controller
{
    public function index()
    {
        return view('all_airport_parking_prices');
    }
}
