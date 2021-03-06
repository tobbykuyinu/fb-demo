<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>eCommerce Shop Ads Tool</title>

        <!-- CSS -->
        <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:400,100,300,500">
        <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="assets/font-awesome/css/font-awesome.min.css">
        <link rel="stylesheet" href="assets/css/form-elements.css">
        <link rel="stylesheet" href="assets/css/style.css">

        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
        <![endif]-->

        <!-- Favicon and touch icons -->
        <link rel="shortcut icon" href="assets/ico/favicon.png">
        <link rel="apple-touch-icon-precomposed" sizes="144x144" href="assets/ico/apple-touch-icon-144-precomposed.png">
        <link rel="apple-touch-icon-precomposed" sizes="114x114" href="assets/ico/apple-touch-icon-114-precomposed.png">
        <link rel="apple-touch-icon-precomposed" sizes="72x72" href="assets/ico/apple-touch-icon-72-precomposed.png">
        <link rel="apple-touch-icon-precomposed" href="assets/ico/apple-touch-icon-57-precomposed.png">
    </head>
    <body>

    <!-- Top content -->
    <div class="top-content">

        <div class="inner-bg">
            <div class="container">

                <div class="row">
                    <div class="col-sm-8 col-sm-offset-2 text">
                        <h1><strong>Facebook</strong> eCommerce Shop Ads Tool</h1>
                        <div class="description">
                            <p>
                                This tool helps you create product adverts automatically from your store on various
                                supported eCommerce platforms. Select a platform, provide your shop url and your facebook
                                page ID and you can create ads automatically for products in your online store!
                            </p>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-1"></div>
                    <div class="col-sm-10">

                        <div class="form-box">
                            <div class="form-top">
                                <div class="form-top-left">
                                    <h3>Get started</h3>
                                    <p>Fill in the form below to get started:</p>
                                </div>
                                <div class="form-top-right">
                                    <i class="fa fa-book"></i>
                                </div>
                            </div>
                            <div class="form-bottom">
                                <form role="form" action="/listing" method="post" class="registration-form">
                                    <div class="form-group">
                                        <label class="sr-only" for="form-platform-select">Select Platform</label>
                                        <select class="form-control" required="required" id="form-platform-select" name="form-platform-select">
                                            <option value="" disabled selected>Select a platform</option>
                                            <option value="amazon_de">Amazon DE</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="sr-only" for="form-store-url">Store URL</label>
                                        <input type="text" required name="form-store-url" placeholder="Merchant Store URL" class="form-control" id="form-store-url">
                                    </div>
                                    <div class="form-group">
                                        <label class="sr-only" for="form-page-id">Page ID</label>
                                        <input type="text" required name="form-page-id" placeholder="Facebook Page ID" class="form-control" id="form-page-id">
                                    </div>
                                    <button type="submit" class="btn">Continue</button>
                                </form>
                            </div>
                        </div>

                    </div>
                    <div class="col-sm-1"></div>
                </div>

            </div>
        </div>

    </div>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="row">

                <div class="col-sm-8 col-sm-offset-2">
                    <div class="footer-border"></div>
                    <p>Made by <a href="mailto:tobbykuyinu@gmail.com" target="_blank"><strong>Tobby Kuyinu</strong></a>
                        having a lot of fun. <i class="fa fa-smile-o"></i></p>
                </div>

            </div>
        </div>
    </footer>

    <!-- Javascript -->
    <script src="assets/js/jquery-1.11.1.min.js"></script>
    <script src="assets/bootstrap/js/bootstrap.min.js"></script>
    <script src="assets/js/jquery.backstretch.min.js"></script>
    <script src="assets/js/scripts.js"></script>

    <!--[if lt IE 10]>
    <script src="assets/js/placeholder.js"></script>
    <![endif]-->

    </body>
</html>