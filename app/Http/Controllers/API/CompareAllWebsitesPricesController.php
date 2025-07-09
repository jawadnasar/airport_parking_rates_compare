<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ParkingWebsitesComparePrices;
use Illuminate\Http\Request;

class CompareAllWebsitesPricesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        dd('This is the index method of CompareAllWebsitesPricesController');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'website_id'       => 'required|integer|exists:parking_websites,id',
                'price'            => 'required|numeric',
                'airport_code'     => 'required|string|size:3',
                'parking_type'     => 'required|string|max:50',
                'from_date'        => 'required|date',
                'to_date'          => 'nullable|date|after_or_equal:from_date',
                'from_time'        => 'nullable|date_format:H:i',
                'to_time'          => 'nullable|date_format:H:i',
                'discount'         => 'nullable|numeric|min:0',
                'transfer_time'    => 'nullable|string|max:20',
                'is_available'     => 'boolean',
                'price_updated_at' => 'required|date',
            ]);

            $cp = new ParkingWebsitesComparePrices();       // cp-> compare prices
            $cp->website_id = $request->website_id;
            $cp->price = $request->price;
            $cp->airport_code = $request->airport_code;
            $cp->parking_type = $request->parking_type;
            $cp->from_date = $request->from_date;
            $cp->to_date = $request->to_date;
            $cp->discount = $request->discount;
            $cp->transfer_time = $request->transfer_time;
            $cp->is_available = $request->is_available ?? true; // Default to true
            $cp->price_updated_at = now(); // Set current time as default

            $cp->save();
            if($cp->wasRecentlyCreated) {
                return response()->json([
                    'message' => 'Parking website price created successfully',
                    'data'    => $cp,
                ], 201);
            } else {
                return response()->json([
                    'message' => 'Parking website price already exists',
                    'data'    => $cp,
                ], 200);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error',
                'errors'  => $e->errors(),
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
