<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdvertController extends Controller
{

    public function listing(Request $request)
    {
        dd($request->all());
    }
}
