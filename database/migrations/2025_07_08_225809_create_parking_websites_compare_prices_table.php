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
        Schema::create('parking_websites_compare_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('website_id')->constrained('parking_websites');
            $table->char('airport_code', 3); // "JFK", "LAX", etc.
            $table->string('parking_company_name')->nullable();
            $table->string('parking_type');  // "Onsite", "Offsite", "Meet & Greet"
            $table->date('from_date');
            $table->date('to_date')->nullable();
            $table->time('from_time')->nullable();
            $table->time('to_time')->nullable();
            $table->decimal('price', 8, 2);
            $table->decimal('discount', 8, 2)->default(0.00)->change(); // Default to 0.00
            $table->string('transfer_time')->nullable(); // in minutes
            $table->boolean('is_available')->default(true);
            $table->timestamp('price_updated_at');
            $table->timestamps();

            $table->index(['airport_code', 'parking_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parking_websites_compare_prices');
    }
};
