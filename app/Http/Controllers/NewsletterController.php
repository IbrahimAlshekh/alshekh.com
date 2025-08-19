<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NewsletterController extends Controller
{
    /**
     * Handle a newsletter subscription request.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function subscribe(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
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

                    return response()->json([
                        'success' => true,
                        'message' => 'Your subscription has been reactivated!',
                    ]);
                }

                // Already actively subscribed
                return response()->json([
                    'success' => true,
                    'message' => 'You are already subscribed to our newsletter!',
                ]);
            }

            // Create new subscriber
            NewsletterSubscriber::create([
                'email' => $request->email,
                'subscribed_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Thank you for subscribing to our newsletter!',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your subscription.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
