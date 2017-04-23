<?php
$html = <<<ABC
<html>
    <head>
        <title>Product Parser</title>
        <script type="text/javascript" src="../public/scripts/jquery-3.2.1.min.js"></script>
        <script type="text/javascript">
            <?php $page = file_get_contents('https://www.amazon.de/ATELIER-ICKX/b/ref=bl_dp_s_web_12199127031?ie=UTF8&node=12199127031&field-lbr_brands_browse-bin=ATELIER+ICKX');?>
            jQuery('#pframe').html(<?php echo 'me'; ?>);

            console.log(jQuery('iframe').contents().find('h2.s-access-title.a-text-normal').html());
        </script>
    </head>
    <body>
        <div id="listing-view"></div>
        <iframe id="pframe"></iframe>
    </body>
</html>
ABC;
echo $html;
 ?>
<?php

//$page = file_get_contents('https://www.amazon.de/ATELIER-ICKX/b/ref=bl_dp_s_web_12199127031?ie=UTF8&node=12199127031&field-lbr_brands_browse-bin=ATELIER+ICKX');
//file_put_contents('/temp/listing.html', $page, FILE_USE_INCLUDE_PATH);
?>


<?php
//preg_match('/<html(.*?)>(.*?)<\/html>/s', $page, $matches);
//var_dump($matches);

//$dom = new DOMDocument;
//@$dom->loadHTML($matches[2]);
//$body = $dom->getElementsByTagName('html');
//
//$content = $body->item(0)->textContent;
////print($content);
//
//$content = preg_replace('/<script>(.*?)<\/script>/s', '', $content);
//$content = preg_replace('/function\((.*?)\)\{(.*?)\}/s', '', $content);
//$content = preg_replace('/function(.*?)\((.*?)\)\{(.*?)\}/s', '', $content);
//print($content);
