<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        User::create([
            'name'              => 'Test User',
            'email'             => 'test@example.com',
            'password'          => bcrypt('password123'), // Always hash passwords
            'email_verified_at' => now(),
        ]);

        // Optional: Create admin user
        User::create([
            'name'              => 'Admin User',
            'email'             => 'admin@example.com',
            'password'          => bcrypt('admin123'),
            'email_verified_at' => now(),
        ]);
    }
}
