<?php
include "code/db_connect.php";
include "code/functions.php";
include "code/core.php";
?>
<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title><?php get_lang(10);?></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="shortcut icon" type="image/png" href="assets/images/favico.png">
        <!-- Place favicon.ico in the root directory -->

		<!-- all css here -->
		<!-- bootstrap v3.3.7 css -->
        <link rel="stylesheet" href="assets/css/bootstrap.min.css">
		<!-- animate css -->
        <link rel="stylesheet" href="assets/css/animate.css">
		<!-- owl.carousel.2.0.0-beta.2.4 css -->
        <link rel="stylesheet" href="assets/css/owl.carousel.css">
		<!-- font-awesome v4.6.3 css -->
        <link rel="stylesheet" href="assets/css/font-awesome.min.css">
		<!-- magnific-popup.css -->
        <link rel="stylesheet" href="assets/css/magnific-popup.css">
		<!-- slicknav.min.css -->
        <link rel="stylesheet" href="assets/css/slicknav.min.css">
		<!-- flaticon.css -->
        <link rel="stylesheet" href="assets/css/flaticon.css">
		<!-- style css -->
		<link rel="stylesheet" href="assets/css/styles.css">
		<!-- responsive css -->
        <link rel="stylesheet" href="assets/css/responsive.css">
		<!-- modernizr css -->
        <script src="assets/js/vendor/modernizr-2.8.3.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->



        <?php
        include 'template/files/header.php';
        if(isset($_GET['item'])){include 'template/files/page_header.php';}
        include 'template/content/'.$content.'.php';
        include 'template/files/footer.php';
        ?>


        <!-- footer-area start -->

        <!-- footer-area end -->
		<!-- jquery latest version -->
        <script src="assets/js/vendor/jquery-1.12.4.min.js"></script>
		<!-- bootstrap js -->
        <script src="assets/js/bootstrap.min.js"></script>
		<!-- owl.carousel.2.0.0-beta.2.4 css -->
        <script src="assets/js/owl.carousel.min.js"></script>
		<!-- counterup.main.js -->
        <script src="assets/js/counterup.main.js"></script>
		<!-- isotope.pkgd.min.js -->
        <script src="assets/js/imagesloaded.pkgd.min.js"></script>
		<!-- isotope.pkgd.min.js -->
        <script src="assets/js/isotope.pkgd.min.js"></script>
		<!-- jquery.waypoints.min.js -->
        <script src="assets/js/jquery.waypoints.min.js"></script>
		<!-- jquery.slicknav.min.js -->
        <script src="assets/js/jquery.slicknav.min.js"></script>
		<!-- jquery.magnific-popup.min.js -->
        <script src="assets/js/jquery.magnific-popup.min.js"></script>
		<!-- jquery.particleground.min.js -->
        <script src="assets/js/jquery.particleground.min.js"></script>
		<!-- wow js -->
        <script src="assets/js/wow.min.js"></script>
		<!-- plugins js -->
        <script src="assets/js/plugins.js"></script>
		<!-- main js -->
        <script src="assets/js/scripts.js"></script>
    </body>
</html>
