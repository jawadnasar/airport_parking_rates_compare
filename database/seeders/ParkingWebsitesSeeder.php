<?php

namespace Database\Seeders;

use App\Models\ParkingWebsite;
use Illuminate\Database\Seeder;

class ParkingWebsitesSeeder extends Seeder
{
    public function run()
    {
        $websites = [
            [
                'id' => 1,
                'name' => 'Looking For Parking',
                'base_url' => 'booking.parking.looking4.com',
                'logo_url' => 'https://cdn.partners.product.cavu-services.com/images/cavu-ecommerce-emea-limited_logo_9446c84d-c069-4cbc-bd52-083f02b1d194.svg',
                'trust_score' => 4.5
            ],
            [
                'name' => 'AirportParking',
                'base_url' => 'www.airportparking.com',
                'logo_url' => 'https://www.airportparking.com/images/logo.png',
                'trust_score' => 4.2
            ],
            [
                'name' => 'ParkFly',
                'base_url' => 'www.parkfly.com',
                'logo_url' => 'https://www.parkfly.com/assets/img/logo.svg',
                'trust_score' => 4.0
            ],
            [
                'name' => 'SkyParkSecure',
                'base_url' => 'www.skyparksecure.com',
                'logo_url' => 'https://skyparksecure.com/wp-content/uploads/2023/01/skypark-logo.png',
                'trust_score' => 4.7
            ],
            [
                'name' => 'JustPark',
                'base_url' => 'www.justpark.com',
                'logo_url' => 'https://www.justpark.com/images/justpark-logo.svg',
                'trust_score' => 4.3
            ]
        ];

        foreach ($websites as $website) {
            ParkingWebsite::updateOrCreate(
                ['id' => $website['id'] ?? null],
                $website
            );
        }
    }
}