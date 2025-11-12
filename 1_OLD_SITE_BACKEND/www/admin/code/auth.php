<?php
$login=$_POST['login'];
$pass=$_POST['pass'];
include "../../code/db_connect.php";
	$result = mysql_query("SELECT * FROM admin_users WHERE login='$login' AND password='$pass'",$db);
	$data = mysql_fetch_array($result);
	if($data){echo "1"; }else{echo "не верный логин или пароль";}
