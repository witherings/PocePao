<?php 
if(isset($_POST['add'])){
		  
	if($_FILES["photo"]){
  	$target_dir='../assets/images/clients/';
	
	$target_file = $target_dir . basename($_FILES["photo"]["name"]);
	$uploadOk = 1;
	$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	$file_name='_' . $id . '.' . $imageFileType;
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

$url=$_POST['url'];
$sort=$_POST['sort'];

		mysql_query("INSERT INTO clients (file, url, sort) VALUES ('$file_name', '$url', '$sort')", $db);		  

	
		echo "<script>toastr.success('Новая запись успешно добавлена','Запись добавлена');</script>";
} 

if(isset($_POST['edit'])){
		$id=$_POST['edit'];
		
			  
	if($_FILES["photo"]){
  	$target_dir='../assets/images/clients/';
	
	$target_file = $target_dir . basename($_FILES["photo"]["name"]);
	$uploadOk = 1;
	$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	$file_name='_' . $id . '.' . $imageFileType;
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
	 mysql_query("UPDATE clients SET file='$file_name' WHERE id='$id'", $db);
}		  

$url=$_POST['url'];
$sort=$_POST['sort'];
 mysql_query("UPDATE clients SET url='$url', sort='$sort' WHERE id='$id'", $db);
	
		echo "<script>toastr.success('Запись успешно сохранена','Запись добавлена');</script>";
}



if(isset($action)){include "template/content/$item/$action.php";}else{?>
        <div class="wrapper wrapper-content  animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox">
                        <div class="ibox-title">
                            <h5>Список</h5>
                            <div class="ibox-tools">
                                <a href="index.php?item=<?php echo $item?>&sub=<?php echo $_GET['sub'];?>&action=add_partnery" class="btn btn-primary "><i class="fa fa-plus"></i> Добавить партнера</a>
                            </div>
                        </div>
                        <div class="ibox-content">

                            <div class="table-responsive">
                            <table class="table table-hover issue-tracker">
                                <tbody>
                                <tr style="font-weight:bold;">
                                	<td style="width:40px;">#</td>
                                    <td class="issue-info">Лого</td>
                                    <td>Ссылка</td>
                                    <td>Сортировка</td>
                                    <td class="text-right">
                                         Действия
                                    </td>
                                </tr>
<?php
$a=0;
$result = mysql_query("SELECT * FROM clients ORDER BY sort", $db);
$data = mysql_fetch_array($result);
	if($data)do{ $a++;
?>	
                                <tr id="<?php echo $data['id']?>">
                                	<td style="width:40px;"><?php echo $a;?></td>
                                    <td><img src="../assets/images/clients/<?php echo $data['file'];?>" alt="" width="180" height="115"></td>
                                    <td><?php echo $data['url'];?></td>
                                    <td><?php echo $data['sort'];?></td>
                                    <td class="text-right">
                                         <a href="index.php?item=<?php echo $item?>&sub=<?php echo $_GET['sub'];?>&action=edit_partnery&id=<?php echo $data['id']?>" class="btn btn-info"> <i class="fa fa-pencil"></i></a>
                                         <button type="button" class="btn btn-danger" onClick="delete_item('clients','<?php echo $data['id']?>','<?php echo $data['id']?>');"> <i class="fa fa-trash"></i></button>
                                    </td>
                                </tr>
<?php	} while($data = mysql_fetch_array($result));  ?>
                                </tbody>
                            </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


        </div>
<?php } ?>        

