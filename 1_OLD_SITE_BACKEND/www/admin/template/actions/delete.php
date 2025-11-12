<?php
$table=$_POST['table_name'];
$id=$_POST['coll_id'];
$lang=$_POST['lang'];
include "../../../code/db_connect.php";

$lang=$_GET['lang'];


if($table=='catalog' || $table=='articles' || $table=='slider'){
	$result = mysql_query("SELECT * FROM $table WHERE id='$id'", $db);
	$data = mysql_fetch_array($result);
}



if($table=='catalog_'.$lang){
	$result = mysql_query("SELECT * FROM catalog_images_$lang WHERE goods_id='$id'", $db);
	$data = mysql_fetch_array($result);
	do{
		$image=$data['image'];
		unlink("../../../images/_catalog/04/$image");
	} while($data = mysql_fetch_array($result));
	mysql_query("DELETE FROM catalog_images_$lang WHERE goods_id='$id'", $db);
}

if($table=='slider_'.$lang){
	$result = mysql_query("SELECT * FROM slider_$lang WHERE id='$id'", $db);
	$data = mysql_fetch_array($result);
	do{
		$image=$data['img'];
		unlink("../../../images/_slider/$image");
	} while($data = mysql_fetch_array($result));
}

if(mysql_query("DELETE FROM $table WHERE id='$id'", $db)){echo '1';}



/*
if($table=='news_ru' || $table=='news_en' || $table=='news_ua'){

	$result = mysql_query("SELECT * FROM $table WHERE id='$id' AND img IS NOT NULL AND img_big IS NOT NULL", $db);
	$data = mysql_fetch_array($result);
	if($data){
	$img=$data['img'];
	$img_big=$data['img_big'];
	$img1="../../../upload/news/$img";
	$img2="../../../upload/news/$img_big";
	if(file_exists($img1)){unlink($img1);}
	if(file_exists($img2)){unlink($img2);}
	}

	if(mysql_query("DELETE FROM $table WHERE id='$id'", $db)){echo '1';}
}

if($table=='gallery'){
	if(unlink("../../../upload/gallery/$id.jpg")){echo '1';}
}

if($table=='slider_ru' || $table=='slider_en' || $table=='slider_ua'){
	if(unlink("../../../upload/$table/$id.jpg")){echo '1';}
}

if($table=='events_ru' || $table=='events_en' || $table=='events_ua'){
	if(mysql_query("DELETE FROM $table WHERE id='$id'", $db)){echo '1';}
}


if($table=='news_pics'){
	$result = mysql_query("SELECT * FROM news_pics WHERE id='$id'", $db);
	$data = mysql_fetch_array($result);
	$img=$data['img'];
	unlink("../../../upload/news/$img");
	unlink("../../../upload/news/big/$img");
}

if($table=='profile_pics'){
	$result = mysql_query("SELECT * FROM profile_pics WHERE id='$id'", $db);
	$data = mysql_fetch_array($result);
	$img=$data['img'];
	unlink("../../../upload/profile/$img");
	unlink("../../../upload/profile/big/$img");
}

if($table=='index_logos'){
	$result = mysql_query("SELECT * FROM index_logos WHERE id='$id'", $db);
	$data = mysql_fetch_array($result);
	$img=$data['img'];
	unlink("../../../upload/index/$img");
}

if($table=='clients'){
	if(unlink("../../../upload/clients/$id.jpg")){echo '1';}
}


if($table=='services'){
	$result = mysql_query("SELECT img FROM services WHERE id='$id'", $db);
	$data = mysql_fetch_array($result);
	if($data)
	do{
		$img=$data['img'];
		unlink("../../../upload/shows/$img");
	} while($data = mysql_fetch_array($result));
	mysql_query("DELETE FROM services WHERE id='$id'", $db);
}


if($table!='clients'){
	if(mysql_query("DELETE FROM $table WHERE id='$id'", $db)){echo '1';}
}

*/

?>
