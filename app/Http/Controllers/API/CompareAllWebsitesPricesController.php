<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ParkingWebsitesComparePrices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CompareAllWebsitesPricesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd('This is the index method of CompareAllWebsitesPricesController');
        return view('all_airport_parking_prices');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // return response()->json([
        //     'message' => 'This is the store method of CompareAllWebsitesPricesController',
        //     'data'    => $request->all(),
        //     'data2' =>file_get_contents('php://input')
        // ], 200);
        // $input_string = file_get_contents('php://input'); // if the input is a string then it will be the request body
        // if ($input_string) {
        //     $request = json_decode($input_string, true); // decode the JSON string to an associative array
        // }
        try {

            // Deleting the records for today that already exist
            ParkingWebsitesComparePrices::where('website_id', $request[0]['website_id'])
                ->whereDate('from_date', $request[0]['from_date'])
                ->whereDate('to_date', $request[0]['to_date'])
                ->whereDate('created_at', now()->toDateString())
                ->delete();

            $data = $request->json()->all(); // Get the JSON data from the request
            foreach ($data as $key => $item) {
                $validator = Validator::make($item, [
                    'website_id'    => 'required|integer|exists:parking_websites,id',
                    'product_title' => 'required|string|max:255',
                    'price'         => 'required|numeric',
                    'airport_code'  => 'required|string',
                    'parking_type'  => 'required|string|max:50',
                    'from_date'     => 'required|date',
                    'to_date'       => 'nullable|date|after_or_equal:from_date',
                    'from_time'     => 'nullable|date_format:H:i',
                    'to_time'       => 'nullable|date_format:H:i',
                    'transfer_time' => 'nullable|string',
                    'is_available'  => 'boolean',
                ]);

                $cp                       = new ParkingWebsitesComparePrices(); // cp-> compare prices
                $cp->website_id           = $item['website_id'];
                $cp->parking_company_name = $item['product_title']; // Assuming product_title is the parking company name
                $cp->price                = $item['price'];
                $cp->airport_code         = 'LGW'; // Assuming 'LGW' is a constant airport code, you can change it as needed
                $cp->parking_type         = $item['parking_type'];
                $cp->from_date            = $item['from_date'];
                $cp->to_date              = $item['to_date'];
                $cp->from_time            = $item['from_time'] ?? null; // Nullable, so default to null if not provided
                $cp->to_time              = $item['to_time'] ?? null;   // Nullable, so default to null if not provide
                $cp->transfer_time        = $item['transfer_time'];
                $cp->is_available         = $item['is_available'] ?? true; // Default to true
                $cp->price_updated_at     = now();                         // Set current time as default
                $cp->parking_type         = $item['parking_type'];                        // Default parking type if not provided

                $cp->save();
                if (! $cp->wasRecentlyCreated) {
                    return response()->json([
                        'message' => 'Parking website price already exists',
                        'data'    => $cp,
                    ], 200);
                }
            }
            return response()->json([
                'message' => 'Parking website price created successfully',
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error',
                'error'   => $e->getMessage(),
            ], 500);
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
