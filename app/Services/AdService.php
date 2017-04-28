<?php

namespace App\Services;

use App\Components\Platforms;
use FacebookAds\Api;
use FacebookAds\Object\Campaign;

class AdService
{
    public function __construct()
    {
        $appId = '';
        $appSecret = '';
        $accessToken = '';
        Api::init($appId, $appSecret, $accessToken);
        $this->facebookApi = Api::instance();
    }

    public function createAds($adAccountId, $pageId, $products, $bid, $currency)
    {
        $campaign = $this->createCampaign($adAccountId);
    }

    private function prepareAd($products)
    {

    }

    private function createCampaign($accountId)
    {
        return new Campaign(null, $accountId);
    }

    private function createAdSet()
    {

    }

    public function getListings($platform, $storeUrl)
    {
        $class = $this->getTemplate($platform);

        /** @var Platforms\Platform $platform */
        $platform = new $class($storeUrl);
        $products = $platform->getProducts();

        return $products;
    }

    private function getTemplate($template)
    {
        $data = [
            'amazon_de' => Platforms\AmazonDE::class
        ];

        return $data[$template];
    }
}