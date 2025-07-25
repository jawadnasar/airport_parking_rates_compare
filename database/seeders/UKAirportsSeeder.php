<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UKAirportsSeeder extends Seeder
{
    public function run(): void
    {
        $airports = [
            [
                'name' => 'London Heathrow Airport',
                'code' => 'LHR',
                'city' => 'London',
                'country' => 'United Kingdom',
                'latitude' => 51.4700,
                'longitude' => -0.4543
            ],
            [
                'name' => 'London Gatwick Airport',
                'code' => 'LGW',
                'city' => 'London',
                'country' => 'United Kingdom',
                'latitude' => 51.1537,
                'longitude' => -0.1821
            ],
            [
                'name' => 'Manchester Airport',
                'code' => 'MAN',
                'city' => 'Manchester',
                'country' => 'United Kingdom',
                'latitude' => 53.3659,
                'longitude' => -2.2727
            ],
            [
                'name' => 'Birmingham Airport',
                'code' => 'BHX',
                'city' => 'Birmingham',
                'country' => 'United Kingdom',
                'latitude' => 52.4539,
                'longitude' => -1.7480
            ],
            [
                'name' => 'Edinburgh Airport',
                'code' => 'EDI',
                'city' => 'Edinburgh',
                'country' => 'United Kingdom',
                'latitude' => 55.9500,
                'longitude' => -3.3725
            ],
            [
                'name' => 'Glasgow Airport',
                'code' => 'GLA',
                'city' => 'Glasgow',
                'country' => 'United Kingdom',
                'latitude' => 55.8719,
                'longitude' => -4.4331
            ],
            [
                'name' => 'Bristol Airport',
                'code' => 'BRS',
                'city' => 'Bristol',
                'country' => 'United Kingdom',
                'latitude' => 51.3827,
                'longitude' => -2.7191
            ],
            [
                'name' => 'Newcastle Airport',
                'code' => 'NCL',
                'city' => 'Newcastle',
                'country' => 'United Kingdom',
                'latitude' => 55.0375,
                'longitude' => -1.6917
            ],
            [
                'name' => 'London Luton Airport',
                'code' => 'LTN',
                'city' => 'Luton',
                'country' => 'United Kingdom',
                'latitude' => 51.8747,
                'longitude' => -0.3683
            ],
            [
                'name' => 'London Stansted Airport',
                'code' => 'STN',
                'city' => 'London',
                'country' => 'United Kingdom',
                'latitude' => 51.8850,
                'longitude' => 0.2350
            ],
        ];

        DB::table('airports')->insert($airports);
    }
}
