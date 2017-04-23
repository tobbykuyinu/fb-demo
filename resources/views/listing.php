<html>
    <head>
        <title>Listing Page</title>
        <script src="/js/jquery-3.2.1.min.js"></script>
    </head>
    <body>
        Hello World
        <?php foreach($pages as $i => $page) { ?>
            <tr>
                <td><a href="<?php echo $page ?>"><?php echo $attrs[$i]['title'] ?></a></td>
                <td><img src="<?php echo $attrs[$i]['image'] ?>"/></td>
                <td><?php echo $attrs[$i]['price'] ?></td>
                <td><?php echo $attrs[$i]['description'] ?></td>
            </tr>
        <?php }?>
    </body>
</html>