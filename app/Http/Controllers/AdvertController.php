<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AdService;

class AdvertController extends Controller
{
    private $adService;

    public function __construct(AdService $adService)
    {
        $this->adService = $adService;
    }

    public function listing(Request $request)
    {
        $fields = $request->all();
        $platform = $fields['form-platform-select'];
        $storeUrl = $fields['form-store-url'];
        $fbPageId = $fields['form-page-id'];

        $products = $this->adService->getListings($platform, $storeUrl);
        //$products = [];

        return view('listing', ['products' => $products, 'fbPageId' => $fbPageId]);
    }
}
