<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Response;
use Inertia\Ssr\Response as SsrResponse;

class NewsletterController extends Controller
{
    /**
     * Handle a newsletter subscription request.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function subscribe(Request $request): Response|SsrResponse|RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        try {
            // Check if already subscribed
            $existingSubscriber = NewsletterSubscriber::where('email', $request->email)->first();

            if ($existingSubscriber) {
                // If already subscribed but inactive, reactivate
                if (!$existingSubscriber->is_active) {
                    $existingSubscriber->update([
                        'is_active' => true,
                        'subscribed_at' => now(),
                    ]);

                    return back()->with('success', 'Your subscription has been reactivated!');
                }

                // Already actively subscribed
                return back()->with('success', 'You are already subscribed to our newsletter!');
            }

            // Create new subscriber
            NewsletterSubscriber::create([
                'email' => $request->email,
                'subscribed_at' => now(),
            ]);

            return back()->with('success', 'Thank you for subscribing to our newsletter!');
        } catch (Exception) {
            return back()->with('error', 'An error occurred while processing your subscription.');
        }
    }
}
