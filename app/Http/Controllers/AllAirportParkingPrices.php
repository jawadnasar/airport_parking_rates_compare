<?php
namespace App\Http\Controllers;

use App\Exports\AirportParkingExport;
use App\Models\ParkingWebsite;
use App\Models\ParkingWebsitesComparePrices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class AllAirportParkingPrices extends Controller
{
    public function index()
    {
        $parkingWebsites = ParkingWebsite::all();
        return view('all_airport_parking_prices', compact('parkingWebsites'));
    }

    public function search_by_dates(Request $request)
    {
        $parkingWebsites = ParkingWebsite::all();

        $parkingPrices = ParkingWebsitesComparePrices::whereDate('from_date', '>=', $request->from_date)
            ->whereDate('from_date', '<=', $request->to_date)
            ->when($request->website_id, function ($query) use ($request) { // When website_id is provided, filter by it
                return $query->where('website_id', $request->website_id);
            })
            ->orderBy('from_date', 'asc')
            ->orderBy('to_date', 'asc')
            ->orderBy('parking_company_name', 'asc')
            ->get();
                                                                                                // return $parkingPrices->tosql();
        return view('all_airport_parking_prices', compact('parkingPrices', 'parkingWebsites')); // Pass the date or
    }

    public function download_excel(Request $request)
    {
        // $data = ParkingWebsitesComparePrices::whereDate('from_date', '>=', $request->from_date)
        //     ->whereDate('from_date', '<=', $request->to_date)
        //     ->when($request->website_id, function ($query) use ($request) {
        //         return $query->where('website_id', $request->website_id);
        //     })
        //     ->orderBy('updated_at', 'desc')
        //     ->orderBy('from_date', 'asc')
        //     ->get();
        // return var_dump($data);

        // $data = DB::select("SELECT p.*
        //             FROM parking_websites_compare_prices p
        //             JOIN (
        //                 SELECT parking_company_name, from_date, MAX(updated_at) AS latest_updated_at
        //                 FROM parking_websites_compare_prices
        //                 WHERE DATE(from_date) >= :from_date
        //                 AND DATE(from_date) <= :to_date
        //                 AND website_id = :website_id
        //                 GROUP BY parking_company_name, from_date
        //             ) latest
        //             ON p.parking_company_name = latest.parking_company_name
        //             AND p.from_date = latest.from_date
        //             AND p.updated_at = latest.latest_updated_at
        //             ORDER BY  p.from_date ASC", [
        //                 'from_date' => $request->from_date,
        //                 'to_date' => $request->to_date,
        //                 'website_id' => 2
        //             ]);
        //             return var_dump($data);

        $bindings = [$request->from_date, $request->to_date];

        $websiteCondition = '';
        if (! empty($request->website_id)) {
            $websiteCondition = ' AND website_id = ?';
            $bindings[]       = $request->website_id;
        }

        # We only getting the latest prices that are updated today
        $sql = "
            SELECT p.*
            FROM parking_websites_compare_prices p
            JOIN (
                SELECT parking_company_name, from_date, MAX(updated_at) AS latest_updated_at
                FROM parking_websites_compare_prices
                WHERE DATE(from_date) >= ?
                AND DATE(from_date) <= ?
                $websiteCondition
                GROUP BY parking_company_name, from_date
            ) latest
            ON p.parking_company_name = latest.parking_company_name
            AND p.from_date = latest.from_date
            AND p.updated_at = latest.latest_updated_at
            #AND DATE(p.price_updated_at) = DATE(NOW())
            ORDER BY p.from_date ASC
        ";

        $data = DB::select($sql, $bindings);

        $distinctCompaniesNames = collect($data)
            ->pluck('parking_company_name') // get just the column values
            ->unique()                      // remove duplicates
            ->values();                     // reset array keys

        // Convert to collection and get website_ids
        $websiteIds = collect($data)
            ->pluck('website_id')
            ->unique()
            ->values();

        // Now get the websites
        $websites = ParkingWebsite::whereIn('id', $websiteIds)->get();

        // Display as an HTML table
        // echo '<table border="1" cellpadding="8" cellspacing="0" style="margin-top:20px; width:100%;">';
        // echo '<thead><tr><th>Company Name</th><th>From Date</th><th>Created At</th></tr></thead>';
        // echo '<t>';

        $structuredData = collect($data)
            ->groupBy('website_id') // First level: Group by website
            ->map(function ($websiteGroup) {
                return $websiteGroup
                    ->groupBy('parking_company_name') // Second level: Group by company
                    ->map(function ($companyGroup) {
                        return $companyGroup->map(function ($item) {
                            return [
                                'date'       => $item->from_date,
                                'price'      => $item->price, // assuming there's a price field
                                'updated_at' => $item->updated_at,
                            ];
                        })->values(); // Reset array keys
                    });
            });

        // If you need to include website details (not just ID):
        $finalData = $structuredData->mapWithKeys(function ($companies, $websiteId) {
            $website = ParkingWebsite::find($websiteId); // Get website model
            return [
                $website->name => $companies, // Use website name as key
            ];
        });
        $jsonData = json_decode($finalData, true);
        return Excel::download(new AirportParkingExport($jsonData), 'exports_prices.xlsx');

        // return Excel::download(new AirportParkingExport($distinctCompaniesNames, $parkingPrices), 'exports_prices.xlsx');

        // return response()->json(['message' => 'Excel download functionality not implemented yet.']);
    }
}
