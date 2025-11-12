<?php
if($logout=='true'){session_start(); session_destroy();}
session_start();
include "code/core.php";
?>
<!DOCTYPE html>
<html>

<head>
<base href="<?php echo $baseurl;?>">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title><?php echo $title; ?> | Панель управления</title>

    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="font-awesome/css/font-awesome.css" rel="stylesheet">

    <link href="css/animate.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">

</head>

<body class="gray-bg">

    <div class="middle-box text-center loginscreen animated fadeInDown">
        <div>
            <div>

                <h1 class="logo-name"><img src="../assets/images/logo_blue.png" style="width:150px;"></h1>

            </div>
            <h3>Панель управления</h3>
	<div  id="mess" style="color:#D70003;"></div>
            <form class="m-t" role="form" action="index.php" method="post" id="login_form">
                <div class="form-group">
                    <input type="login" name="login" id="login" class="form-control" placeholder="Логин" required="">
                </div>
                <div class="form-group">
                    <input type="password" name="pass" id="pass" class="form-control" placeholder="Пароль" required="">
                </div>
                <a class="btn btn-primary block full-width m-b" onclick="validate_login_form(); return false;">Вход</a>

            </form>
            <p class="m-t"> <small> Панель администрирования v2.0  &copy; <?php echo date('Y');?></small> </p>
        </div>
    </div>

    <!-- Mainly scripts -->
    <script src="js/jquery-2.1.1.js"></script>
    <script src="js/bootstrap.min.js"></script>
<script>
function validate_login_form()
{
	$.post("code/auth.php",{ login:login.value, pass:pass.value } ,function(data){
	if (data==1){login_form.submit();}
	if (data!=1){$("#mess").html(data).fadeTo(400,1);}
	});
}
</script>
</body>

</html>
