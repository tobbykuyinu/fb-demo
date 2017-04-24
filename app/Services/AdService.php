<?php

namespace App\Services;

use App\Components\Platforms;

class AdService
{
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