<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParkingWebsitesComparePrices extends Model
{
    
    protected $fillable = [
        'website_id', 
        'airport_code',
        'parking_type',
        'price',
        'discount',
        'transfer_time',
        'is_available'
    ];
    
    protected $casts = [
        'price_updated_at' => 'datetime',
        'is_available' => 'boolean'
    ];

    
    public function website(): BelongsTo
    {
        return $this->belongsTo(ParkingWebsite::class);
    }
}
