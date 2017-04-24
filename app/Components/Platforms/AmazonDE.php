<?php

namespace App\Components\Platforms;

use DOMDocument;
use DOMXPath;

class AmazonDE implements Platform
{
    private $storeUrl;

    public function __construct($storeUrl)
    {
        $this->storeUrl = $storeUrl;
    }

    public function getProducts()
    {
        $dom = new DOMDocument('1.0');
        @$dom->loadHTMLFile($this->storeUrl);
        $finder = new DOMXPath($dom);
        $className = 's-access-detail-page';
        $nodes = $finder->query("//*[contains(concat(' ', normalize-space(@class), ' '), ' $className ')]");

        $pages = [];
        foreach($nodes as $node) { $pages[] = new Product($node->getAttribute('href'));}

        return $pages;
    }
}
