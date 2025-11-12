<?php
$db = mysql_connect("fj563345.mysql.tools","fj563345_pokepao","%b7AV75*ua");
mysql_select_db("fj563345_pokepao",$db);

mysql_query("SET NAMES 'utf8'");
mysql_query("SET CHARACTER SET 'utf8'");

if(isset($_GET['item'])){$item=$_GET['item'];}
if(isset($_GET['id'])){$id=$_GET['id'];}
if(isset($_GET['lang'])){$lang=$_GET['lang'];}
if(isset($_GET['edit'])){$edit=$_GET['edit'];}
if(isset($_GET['delete'])){$delete=$_GET['delete'];}
if(isset($_GET['type'])){$type=$_GET['type'];}
if(isset($_GET['sys_lang'])){$sys_lang=$_GET['sys_lang'];}
?>
