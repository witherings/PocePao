<?php
$filename = $_POST['filename'];
$img = $_POST['pngimageData'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
file_put_contents($filename, $data);

$type=$_GET['type'];
$pic=$_GET['pic'];
$lang=$_GET['lang'];

if($type=='about'){
	$id=$_GET['id'];
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/$type/";
		$pic_name=$pic.'.jpg';
		$targetFile =  $prePath.$targetPath.$pic_name; 
		copy($tempFile,$targetFile); 
		include "../../code/resize_crop.php";
		if($pic=='1'){$pic_w='1200'; $pic_h='371';}else{$pic_w='400'; $pic_h='244';}
		resize($targetFile, $targetFile, $pic_w,'0');
		$size=array('0', '0', $pic_w, $pic_h);
		crop($targetFile, $targetFile, $size);
	}
}

if($type=='news'){
	$id=$_GET['id'];
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/$type/";
		$pic_name=strtotime(date('Y-m-d H:i:s')).rand(0,100).'.jpg';
		$targetFile =  $prePath.$targetPath.$pic_name; 
		copy($tempFile,$targetFile); 
		include "../../code/resize_crop.php";
		if($pic=='prev'){$pic_w='375'; $pic_h='210'; $cell='img';}else{$pic_w='1200'; $pic_h='500'; $cell='img_big';}
		resize($targetFile, $targetFile, $pic_w,'0');
		$size=array('0', '0', $pic_w, $pic_h);
		crop($targetFile, $targetFile, $size);		
		
		include $prePath."code/db_connect.php";
		mysql_query("UPDATE news_$lang SET $cell='$pic_name' WHERE id='$id'", $db);
	}
}

if($type=='gallery'){
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/gallery/";
		$pic_name=strtotime(date('Y-m-d H:i:s')).rand(0,100).'.jpg';
		$targetFile =  $prePath.$targetPath.$pic_name; 
		move_uploaded_file($tempFile,$targetFile); 
	
		include "../../code/resize_crop.php";
		resize($targetFile, $targetFile, '900','0');
		//$size=array('0', '0', '74','61');
		//crop($targetFile, $targetFile, $size);

	}
}

if($type=='contacts'){
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/contacts/";
		$pic_name='1.jpg';
		$targetFile =  $prePath.$targetPath.$pic_name; 
		move_uploaded_file($tempFile,$targetFile); 
	
		include "../../code/resize_crop.php";
		resize($targetFile, $targetFile, '1200','0');
		$size=array('0', '0', '1200','420');
		crop($targetFile, $targetFile, $size);

	}
}

if($type=='what-we-do'){
	$id=$_GET['id'];
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/$type/";
		$pic_name=strtotime(date('Y-m-d H:i:s')).rand(0,100).'.jpg';
		$targetFile =  $prePath.$targetPath.$pic_name; 
		copy($tempFile,$targetFile); 
		include "../../code/resize_crop.php";
		$pic_w='1200'; $pic_h='371'; $cell='img';
		resize($targetFile, $targetFile, $pic_w,'0');
		$size=array('0', '0', $pic_w, $pic_h);
		crop($targetFile, $targetFile, $size);		
		
		include $prePath."code/db_connect.php";
		mysql_query("UPDATE what_we_do_$lang SET $cell='$pic_name' WHERE id='$id'", $db);
	}
}

if($type=='calendar'){
	$img=$_GET['img'];
	$id=$_GET['id'];
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/calendar/";
		if($img=='new'){
				$pic_name=strtotime(date('Y-m-d H:i:s')).rand(0,100).'.jpg';
				include $prePath."code/db_connect.php";
				mysql_query("UPDATE events_$lang SET img='$pic_name' WHERE id='$id'", $db);
			}else{
				$pic_name=$img.'.jpg';
			}		
		$targetFile =  $prePath.$targetPath.$pic_name; 
		move_uploaded_file($tempFile,$targetFile); 
	
		include "../../code/resize_crop.php";
		if($img=='new'){
			resize($targetFile, $targetFile, '688','0');
			$size=array('0', '0', '688','371');			
		}else{
			resize($targetFile, $targetFile, '1200','0');
			$size=array('0', '0', '1200','371');			
		}
		crop($targetFile, $targetFile, $size);

	}
}
/*
if($type=='news'){
	$id=$_GET['id'];
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/$type/";
		$targetPathBig = "upload/$type/big/";
		$pic_name=strtotime(date('Y-m-d H:i:s')).rand(0,100).'.jpg';
		$targetFile =  $prePath.$targetPath.$pic_name; 
		$targetFileBig =  $prePath.$targetPathBig.$pic_name; 
		copy($tempFile,$targetFile); 
		move_uploaded_file($tempFile,$targetFileBig); 
		
		include "../../code/resize_crop.php";
		resize($targetFile, $targetFile, '177','0');
		$size=array('0', '0', '177','132');
		crop($targetFile, $targetFile, $size);
	
		include $prePath."code/db_connect.php";
		mysql_query("INSERT INTO news_pics (news_id, img) VALUES ('$id', '$pic_name')", $db);
	}
}


if($type=='profile_pics'){
	$id=$_GET['id'];
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/profile/";
		$targetPathBig = "upload/profile/big/";
		$pic_name=strtotime(date('Y-m-d H:i:s')).rand(0,100).'.jpg';
		$targetFile =  $prePath.$targetPath.$pic_name; 
		$targetFileBig =  $prePath.$targetPathBig.$pic_name; 
		copy($tempFile,$targetFile); 
		move_uploaded_file($tempFile,$targetFileBig); 
		
		include "../../code/resize_crop.php";
		resize($targetFile, $targetFile, '90','0');
		$size=array('0', '0', '90','90');
		crop($targetFile, $targetFile, $size);
	
		include $prePath."code/db_connect.php";
		mysql_query("INSERT INTO profile_pics (profile_id, img) VALUES ('$id', '$pic_name')", $db);
	}
}

if($type=='profile'){
	$id=$_GET['id'];
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/profile/";
		$pic_name=$id.'.jpg';		
		$targetFile =  $prePath.$targetPath.$pic_name; 
		move_uploaded_file($tempFile,$targetFile); 
		include "../../code/resize_crop.php";
		resize($targetFile, $targetFile, '1000','0');
	}
}

if($type=='maps_pics'){
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/events/maps/";
		$pic_name=strtotime(date('Y-m-d H:i:s')).rand(0,100).'.png';		
		$targetFile =  $prePath.$targetPath.$pic_name; 
		move_uploaded_file($tempFile,$targetFile); 
		
		include $prePath."code/db_connect.php";
		mysql_query("INSERT INTO maps_pics (img) VALUES ('$pic_name')", $db);
	}
}

if($type=='index_logos'){
	$id=$_GET['id'];
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/index/";
		$pic_name=strtotime(date('Y-m-d H:i:s')).rand(0,100).'.png';
		$targetFile =  $prePath.$targetPath.$pic_name; 
		move_uploaded_file($tempFile,$targetFile); 
	
		include $prePath."code/db_connect.php";
		mysql_query("INSERT INTO index_logos (img) VALUES ('$pic_name')", $db);
	}
}


if($type=='clients'){
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/clients/";
		$pic_name=strtotime(date('Y-m-d H:i:s')).rand(0,100).'.jpg';
		$targetFile =  $prePath.$targetPath.$pic_name; 
		move_uploaded_file($tempFile,$targetFile); 
	
		include "../../code/resize_crop.php";
		resize($targetFile, $targetFile, '74','0');
		$size=array('0', '0', '74','61');
		crop($targetFile, $targetFile, $size);

	}
}


if($type=='services'){
	$id=$_GET['id'];
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/shows/";
		$pic_name=strtotime(date('Y-m-d H:i:s')).rand(0,100).'.jpg';
		$targetFile =  $prePath.$targetPath.$pic_name; 
		move_uploaded_file($tempFile,$targetFile); 
		
		include "../../code/resize_crop.php";
		resize($targetFile, $targetFile, '358','0');
		$size=array('0', '0', '358','358');
		crop($targetFile, $targetFile, $size);
	
		include $prePath."code/db_connect.php";
		mysql_query("UPDATE services SET img='$pic_name' WHERE id='$id'", $db);
	}
}

if($type=='school'){
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/school/";
		$pic_name='school.jpg';		
		$targetFile =  $prePath.$targetPath.$pic_name; 
		move_uploaded_file($tempFile,$targetFile); 
	}
}

if($type=='fteams'){
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/school/";
		$pic_name='school_logos.png';		
		$targetFile =  $prePath.$targetPath.$pic_name; 
		move_uploaded_file($tempFile,$targetFile); 
	}
}

if($type=='coaches'){
	$id=$_GET['id'];
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/coaches/";
		$pic_name=strtotime(date('Y-m-d H:i:s')).rand(0,100).'.jpg';
		$targetFile =  $prePath.$targetPath.$pic_name; 
		move_uploaded_file($tempFile,$targetFile); 
		
		include "../../code/resize_crop.php";
		resize($targetFile, $targetFile, '358','0');
		$size=array('0', '0', '358','358');
		crop($targetFile, $targetFile, $size);
	
		include $prePath."code/db_connect.php";
		mysql_query("UPDATE coaches SET img='$pic_name' WHERE id='$id'", $db);
	}
}

if($type=='background'){
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/others/";
		$pic_name=$page.'_bg.jpg';		
		$targetFile =  $prePath.$targetPath.$pic_name; 
		move_uploaded_file($tempFile,$targetFile); 
	}
}

if($type=='profile_pic'){
	if (!empty($_FILES)) {
		$tempFile = $_FILES['file']['tmp_name']; 
		$prePath="../../../";
		$targetPath = "upload/profile/";
		$pic_name='player'.$id.'.png';		
		$targetFile =  $prePath.$targetPath.$pic_name; 
		move_uploaded_file($tempFile,$targetFile); 
	}
}
*/
?>     