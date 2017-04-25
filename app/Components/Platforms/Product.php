<?php

namespace App\Components\Platforms;

use DOMDocument;

class Product implements IProduct
{
    private $productUrl;
    private $id;
    private $price;
    private $description;
    private $title;
    private $brand;
    private $image;

    public function __construct($productUrl)
    {
        $this->productUrl = $productUrl;

        $dom = new DOMDocument('1.0');
        @$dom->loadHTMLFile($productUrl);

        $this->id = trim($dom->getElementById('ASIN')->getAttribute('value'));
        $price = $dom->getElementById('priceblock_ourprice') ?? $dom->getElementById('priceblock_saleprice');
        $price = $price ? $price->nodeValue : '';
        $this->price = trim($price);
        $this->description = trim($dom->getElementById('productDescription')?
            $dom->getElementById('productDescription')->nodeValue : '');
        $this->title = trim($dom->getElementById('productTitle')->nodeValue);
        $this->brand = trim($dom->getElementById('brand')->nodeValue);
        $this->image = trim($dom->getElementById('landingImage')->getAttribute('src'));
    }

    public function getId()
    {
        return $this->id;
    }

    public function getBrand()
    {
        return $this->brand;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function getImage()
    {
        return $this->image;
    }

    public function getPrice()
    {
        return $this->price;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function getProductLink()
    {
        return $this->productUrl;
    }
}