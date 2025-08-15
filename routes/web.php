<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('welcome', function () {
    echo config('inertia.ssr.url');
    $response = Inertia::render('welcome');
    dd($response);
    return 'test';
});

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
