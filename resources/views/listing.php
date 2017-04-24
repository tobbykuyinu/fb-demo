<html>
    <head>
        <title>Listing Page</title>
        <script src="/js/jquery-3.2.1.min.js"></script>
    </head>
    <body>
        Hello World
        <?php foreach($products as $i => $product) { ?>
            <tr>
                <td><a href="<?php echo $product->getProductLink() ?>"><?php echo $product->getTitle() ?></a></td>
                <td><img src="<?php echo $product->getImage() ?>"/></td>
                <td><?php echo $product->getPrice() ?></td>
                <td><?php echo $product->getDescription() ?></td>
            </tr>
        <?php }?>
    </body>
</html>