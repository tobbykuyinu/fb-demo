<?php

namespace App\Components\Platforms;

interface IProduct
{
    public function getId();
    public function getPrice();
    public function getTitle();
    public function getDescription();
    public function getBrand();
    public function getImage();
    public function getProductLink();
}