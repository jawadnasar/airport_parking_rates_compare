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
                'name' => 'Compare Parking Deals',
                'base_url' => 'https://compareparkingdeals.co.uk/',
                'logo_url' => 'https://compareparkingdeals.co.uk/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.df102680.png&w=384&q=75',
                'trust_score' => 4.2
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