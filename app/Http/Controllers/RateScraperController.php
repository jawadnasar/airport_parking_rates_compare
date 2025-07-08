<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


class RateScraperController extends Controller
{
    public function all_websites_prices(Request $request)
    {
        // Example: get data from FormData or JSON
        $title = $request->input('title');
        $prices = $request->input('prices'); // Assume array of prices

        // Process the data (store, log, etc.)
        // For now, just return it

        return response()->json([
            'status' => 'success',
            'received_title' => $title,
            'received_prices' => $prices,
        ]);
    }
}
