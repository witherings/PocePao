<?php
if(isset($_POST['add'])){
		$text_big=$_POST['text_big'];
		$text_small=$_POST['text_small'];
		$url=$_POST['url'];
		$sort=$_POST['sort'];
		$status=$_POST['status'];
		
	if($_FILES["photo"]){
  	$target_dir='../images/_slider/';
	
	$target_file = $target_dir . basename($_FILES["photo"]["name"]);
	$uploadOk = 1;
	$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	$file_name=str_replace(".","",uniqid(rand(), true)) . '.' . $imageFileType;
	$new_file=$target_dir.$file_name; 
	
	// Check if image file is a actual image or fake image
	  $check = getimagesize($_FILES["photo"]["tmp_name"]);
	  if($check !== false) {
		//echo "File is an image - " . $check["mime"] . ".<br>";
		$uploadOk = 1;
	  } else {
		echo "Файл не является изображением!<br>";
		$uploadOk = 0;
	  }
	
	
	// Check file size
	/*
	if ($_FILES["photo"]["size"] > 500000) {
	  echo "Размер файла слишком велик!<br>";
	  $uploadOk = 0;
	}
	*/
	
	// Allow certain file formats
	if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
	&& $imageFileType != "gif" ) {
	  echo "Только JPG, JPEG, PNG и GIF!<br>";
	  $uploadOk = 0;
	}
	
	if ($uploadOk == 0) {
	  echo "<br>Файл не был загружен.<br>";
	} else {
	  if (move_uploaded_file($_FILES["photo"]["tmp_name"], $new_file)) {
	  } else {
		echo "Ошибка загрузки файла.<br>";
	  }
	}
}
		
		mysql_query("INSERT INTO slider_$lang (img, text_big, text_small, url, status, sort) VALUES ('$file_name', '$text_big', '$text_small', '$url', '$status', '$sort')", $db);
		
		echo "<script>toastr.success('Новая запись успешно добавлена','Запись добавлена');</script>";
} 


if(isset($_POST['edit'])){
	$id=$_POST['edit'];
		$text_big=$_POST['text_big'];
		$text_small=$_POST['text_small'];
		$url=$_POST['url'];
		$sort=$_POST['sort'];
		$status=$_POST['status'];
		
	if($_FILES["photo"]){
  	$target_dir='../images/_slider/';
	
	$target_file = $target_dir . basename($_FILES["photo"]["name"]);
	$uploadOk = 1;
	$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	$file_name=str_replace(".","",uniqid(rand(), true)) . '.' . $imageFileType;
	$new_file=$target_dir.$file_name; 
	
	// Check if image file is a actual image or fake image
	  $check = getimagesize($_FILES["photo"]["tmp_name"]);
	  if($check !== false) {
		//echo "File is an image - " . $check["mime"] . ".<br>";
		$uploadOk = 1;
	  } else {
		echo "Файл не является изображением!<br>";
		$uploadOk = 0;
	  }
	
	
	// Check file size
	/*
	if ($_FILES["photo"]["size"] > 500000) {
	  echo "Размер файла слишком велик!<br>";
	  $uploadOk = 0;
	}
	*/
	
	// Allow certain file formats
	if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
	&& $imageFileType != "gif" ) {
	  echo "Только JPG, JPEG, PNG и GIF!<br>";
	  $uploadOk = 0;
	}
	
	if ($uploadOk == 0) {
	  echo "<br>Файл не был загружен.<br>";
	} else {
	  if (move_uploaded_file($_FILES["photo"]["tmp_name"], $new_file)) {
		  mysql_query("UPDATE slider_$lang SET img='$file_name' WHERE id='$edit'", $db);
	  } else {
		echo "Ошибка загрузки файла.<br>";
	  }
	}
}

		mysql_query("UPDATE slider_$lang SET text_big='$text_big', text_small='$text_small', url='$url', status='$status', sort='$sort' WHERE id='$edit'", $db);
		
		
		echo "<script>toastr.success('Запись успешно сохранена','Запись добавлена');</script>";
} 


//---------------------------------------------------------------------------------------------------------------------

if(isset($action)){include "template/content/$item/$action.php";}else{?>
<div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">
                            <div class="tab-content">
                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">

                                        <div class="table-responsive">
                                        
                                        <a href="index.php?item=<?php echo $item?>&sub=<?php echo $_GET['sub'];?>&action=add_slider" class="btn btn-success btn-lg">Добавить фото в слайдер</a>
                                         <br><br>
                                            <table class="table table-bordered table-stripped">
                                                <thead>
                                                <tr>
                                                    <th>
                                                        Изображение
                                                    </th>
                                                    <th>
                                                        Действия
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                
                                               <?php 
													$result = mysql_query("SELECT * FROM slider_$lang ORDER BY sort", $db);
													$data = mysql_fetch_array($result);
													if($data)do{
												?>
                                                <tr id="<?php echo $data['id']; ?>">
                                                    <td>
                                                        <img src="../images/_slider/<?php echo $data['img'];?>" width="300">
                                                    </td>
                                                    <td style="width:100%;">
                                                     	<a href="index.php?item=<?php echo $item?>&sub=<?php echo $_GET['sub'];?>&action=edit_slider&id=<?php echo $data['id']?>" class="btn btn-info"> <i class="fa fa-pencil"></i> Редактировать</a>
                                                        <button type="button" class="btn btn-danger" onClick="delete_item('slider_<?php echo $lang;?>','<?php echo $data['id'];?>','<?php echo $data['id'];?>');"> <i class="fa fa-trash"></i> Удалить</button><br>
                                                        <font style="font-size:16px;"><?php echo $data['text_big'];?></font><br>
                                                        <?php echo $data['text_small'];?><br>
                                                        Url: <a href="../<?php echo $data['url'];?>" target="_blank"><?php echo $data['url'];?></a><br>
                                                        Покзывать: <?php if($data['status']=='1'){ echo "да";}else{echo "нет";}?><br>
                                                        Сортировка: <?php echo $data['sort'];?>
                                                    </td>
                                                </tr>
												<?php	} while($data = mysql_fetch_array($result)); ?> 
                                                
                                                </tbody>
                                            </table>
                                           
                                           
                                        </div>

                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>

        </div>

<?php } ?> 