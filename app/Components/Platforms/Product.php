<?php

namespace App\Components\Platforms;

use DOMDocument;
use DOMXPath;

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
        $finder = new DOMXPath($dom);
        $nodes = $finder->query("//*[contains(concat(' ', normalize-space(@class), ' '), ' a-color-price ')]");
        $price = $price ?? $nodes[0];

        $this->price = trim($this->valueOrEmpty($price));
        $this->description = $this->valueOrEmpty($dom->getElementById('productDescription'));
        $this->title = $this->valueOrEmpty($dom->getElementById('productTitle'));
        $this->brand = $this->valueOrEmpty($dom->getElementById('brand'));
        $this->image = trim($dom->getElementById('landingImage')->getAttribute('src'));
    }

    private function valueOrEmpty($obj)
    {
        return $obj ? trim($obj->nodeValue) : '';
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