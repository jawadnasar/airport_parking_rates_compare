<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ParkingWebsite extends Model
{
    protected $fillable = ['name', 'base_url', 'logo_url', 'trust_score'];
    
    public function prices(): HasMany
    {
        return $this->hasMany(ParkingWebsitesComparePrices::class, 'website_id');
    }
}
