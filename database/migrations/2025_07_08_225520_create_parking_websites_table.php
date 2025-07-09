<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('parking_websites', function (Blueprint $table) {
            $table->id();
            $table->string('name');     // "ParkFly", "AirportParking", etc.
            $table->string('base_url'); // "https://parkfly.com"
            $table->string('logo_url')->nullable();
            $table->decimal('trust_score', 3, 2)->default(0.00); // 0.00 to 5.00
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parking_websites');
    }
};
