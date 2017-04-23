<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->get('/', function() {
    return view('start');
});
$app->post('/listing', 'AdvertController@listing');
$app->get('/page', function () use ($app) {
    $dom = new DOMDocument('1.0');
    $url = 'https://www.amazon.de/ATELIER-ICKX/b/ref=bl_dp_s_web_12199127031?ie=UTF8&node=12199127031&field-lbr_brands_browse-bin=ATELIER+ICKX';
    @$dom->loadHTMLFile($url);
    $finder = new DOMXPath($dom);
    $className = 's-access-detail-page'; //.a-text-normal
    $nodes = $finder->query("//*[contains(concat(' ', normalize-space(@class), ' '), ' $className ')]");

    $pages = [];
    $attrs = [];
    foreach($nodes as $node) { $pages[] = $node->getAttribute('href');}
    foreach($pages as $i => $page) {
        @$dom->loadHTMLFile($page);

        dd($dom->getElementById('brand')->nodeValue);
        $attrs[] = [
            'title' => trim($dom->getElementById('productTitle')->nodeValue),
            'id' => $dom->getElementById('ASIN')->getAttribute('value'),
            'brand' => $dom->getElementById('brand')->nodeValue,
            'price' => trim(
                $dom->getElementById('priceblock_ourprice') ?
                    $dom->getElementById('priceblock_ourprice')->nodeValue :
                    $dom->getElementById('priceblock_saleprice')->nodeValue
            ),
            'image' => trim($dom->getElementById('landingImage')->getAttribute('src')),
            'description' => trim($dom->getElementById('productDescription')->nodeValue)
        ];
    }
    return view('listing', ['pages' => $pages, 'attrs' => $attrs]);
});
