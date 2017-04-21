<html>
    <head>
        <title>Product Parser</title>
        <script type="text/javascript" src="public/scripts/jquery-3.2.1.min.js"></script>
    </head>
    <body>
        <div id="listing-view"></div>
    </body>
<?php

$page = file_get_contents('https://www.amazon.de/ATELIER-ICKX/b/ref=bl_dp_s_web_12199127031?ie=UTF8&node=12199127031&field-lbr_brands_browse-bin=ATELIER+ICKX');
?>
    <footer>
        <script type="text/javascript">
            $('#listing-view').append(JSON.stringify(<?php echo $page; ?>));
            console.log(jQuery('h2.s-access-title.a-text-normal'));
        </script>
    </footer>
</html>
<?php
preg_match('/<html(.*?)>(.*?)<\/html>/s', $page, $matches);
//var_dump($matches);

$dom = new DOMDocument;
@$dom->loadHTML($matches[2]);
$body = $dom->getElementsByTagName('html');

$content = $body->item(0)->textContent;
//print($content);

$content = preg_replace('/<script>(.*?)<\/script>/s', '', $content);
$content = preg_replace('/function\((.*?)\)\{(.*?)\}/s', '', $content);
$content = preg_replace('/function(.*?)\((.*?)\)\{(.*?)\}/s', '', $content);
//print($content);
