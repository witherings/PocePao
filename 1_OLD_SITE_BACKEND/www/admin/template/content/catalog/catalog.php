<?php
if(isset($_POST['edit_product'])){
		$id=$_POST['edit_product'];
		$title=$_POST['title'];
		$price=$_POST['price'];
		$text=$_POST['text'];
		$text = htmlentities($text, ENT_QUOTES, 'UTF-8');

	$query="UPDATE products SET title='$title', price='$price', text='$text' WHERE id='$id'";
	mysql_query($query, $db);


	if($_FILES["img"]){
  	$target_dir='../assets/images/shop/';

	$target_file = $target_dir . basename($_FILES["img"]["name"]);
	$uploadOk = 1;
	$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	$file_name=date("YmdHis").rand(0,100).'.'.$imageFileType;
	$new_file=$target_dir.$file_name;

	// Check if image file is a actual image or fake image
	  $check = getimagesize($_FILES["img"]["tmp_name"]);
	  if($check !== false) {
		//echo "File is an image - " . $check["mime"] . ".<br>";
		$uploadOk = 1;
	  } else {
		echo "Файл не является изображением!<br>";
		$uploadOk = 0;
	  }


	// Check file size
	if ($_FILES["img"]["size"] > 500000) {
	  echo "Размер файла слишком велик!<br>";
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
	  if (move_uploaded_file($_FILES["img"]["tmp_name"], $new_file)) {
			mysql_query("UPDATE products SET img='$file_name' WHERE id='$id'", $db);
			echo "<script>toastr.success('Запись успешно сохранена','Запись добавлена');</script>";
	  } else {
		echo "Ошибка загрузки файла.<br>";
	  }
	}
}

}
//---------------------------------------------------------------------------------------------------------------------
if(isset($_POST['add_product'])){

	$title=$_POST['title'];
	$price=$_POST['price'];
	$text=$_POST['text'];
	$text = htmlentities($text, ENT_QUOTES, 'UTF-8');
	$cat_id=$_POST['add_product'];


	if($_FILES["img"]){
  $target_dir='../assets/images/shop/';

	$target_file = $target_dir . basename($_FILES["img"]["name"]);
	$uploadOk = 1;
	$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	$file_name= date("YmdHis").rand(0,100).'.'.$imageFileType;
	$new_file=$target_dir.$file_name;

	// Check if image file is a actual image or fake image
	  $check = getimagesize($_FILES["img"]["tmp_name"]);
	  if($check !== false) {
		//echo "File is an image - " . $check["mime"] . ".<br>";
		$uploadOk = 1;
	  } else {
		echo "Файл не является изображением!<br>";
		$uploadOk = 0;
	  }


	// Check file size
	if ($_FILES["img"]["size"] > 500000) {
	  echo "Размер файла слишком велик!<br>";
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
	  if (move_uploaded_file($_FILES["img"]["tmp_name"], $new_file)) {

			$query="INSERT INTO products (title, price, text, img, cat_id) VALUES ('$title','$price','$text','$file_name','$cat_id')";
			mysql_query($query, $db);
			//echo $query;
			echo "<script>toastr.success('Новая запись успешно добавлена','Запись добавлена');</script>";
	  } else {
		echo "Ошибка загрузки файла.<br>";
	}}

	}
}
//---------------------------------------------------------------------------------------------------------------------
if(isset($_POST['add_sub'])){
		$title=$_POST['title'];
		$sub=$_POST['add_sub'];
		$query="INSERT INTO categories (title, sub) VALUES ('$title', '$sub')";
		mysql_query($query, $db);
	echo "<script>toastr.success('Запись успешно сохранена','Запись добавлена');</script>";
}
//---------------------------------------------------------------------------------------------------------------------
if(isset($_POST['add_categories'])){
		$title=$_POST['title'];
		//$text = htmlentities($text, ENT_QUOTES, 'UTF-8');

		$query="INSERT INTO categories (title, sub) VALUES ('$title', '0')";
		mysql_query($query, $db);
	echo "<script>toastr.success('Запись успешно сохранена','Запись добавлена');</script>";
}
//---------------------------------------------------------------------------------------------------------------------
if(isset($_POST['edit_categories'])){
		$id=$_POST['edit_categories'];
		$title=$_POST['title'];
		//$text = htmlentities($text, ENT_QUOTES, 'UTF-8');

	$query="UPDATE categories SET title='$title' WHERE id='$id'";
		mysql_query($query, $db);
	echo "<script>toastr.success('Запись успешно сохранена','Запись добавлена');</script>";
}
//---------------------------------------------------------------------------------------------------------------------
if(isset($action)){include "template/content/catalog/$action.php";}else{?>

<style>
.nonactive{ font-style:italic; color:rgba(197,197,197,1.00);}
</style>
        <div class="wrapper wrapper-content  animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox">
                        <div class="ibox-title">
                            <h5>Список</h5>
														<div class="ibox-tools">
                                <a href="index.php?item=<?php echo $item?>&action=add" class="btn btn-primary "><i class="fa fa-plus"></i> Добавить</a>
                            </div>
                        </div>
                        <div class="ibox-content">

                            <div class="table-responsive">
                            <table class="table table-hover issue-tracker">
                                <tbody>
<?php
$a=0;
$result = mysql_query("SELECT * FROM categories WHERE sub='0' ORDER BY id", $db);
$data = mysql_fetch_array($result);
	if($data)do{ $a++;
	$id=$data['id'];
?>
                                <tr id="<?php echo $a;?>">
                                	<td style="width:40px;"><?php echo $a;?></td>
                                    <td class="issue-info" style="font-weight:bold; text-decoration:underline; font-size:18px;"><?php echo $data['title'];?></td>
                                    <td class="text-right">
																				 <a href="index.php?item=<?php echo $item?>&action=add_sub&id=<?php echo $data['id'];?>" class="btn btn-primary"> <i class="fa fa-plus"></i></a>
																				 <a href="index.php?item=<?php echo $item?>&action=edit&id=<?php echo $data['id'];?>" class="btn btn-info"> <i class="fa fa-pencil"></i></a>
																				 <button type="button" class="btn btn-danger" onClick="delete_item('categories','<?php echo $data['id'];?>','<?php echo $a;?>');"> <i class="fa fa-trash"></i></button>
                                    </td>
                                </tr>
                <?php
									$results = mysql_query("SELECT * FROM categories WHERE sub='$id' ORDER BY id", $db);
									$datas = mysql_fetch_array($results);
										if($datas)do{ $a++;
											$sub_id=$datas['id'];
								?>
                                <tr id="<?php echo $a;?>">
                                	<td style="width:40px;"><?php echo $a;?></td>
                                    <td class="issue-info" style="font-weight:bold; "><p style="margin-left:20px;"> - <?php echo $datas['title'];?></p></td>
                                    <td class="text-right">
																			   <a href="index.php?item=<?php echo $item?>&action=add_product&id=<?php echo $datas['id'];?>" class="btn btn-primary"> <i class="fa fa-plus"></i></a>
                                         <a href="index.php?item=<?php echo $item?>&action=edit&id=<?php echo $datas['id'];?>" class="btn btn-info"> <i class="fa fa-pencil"></i></a>
																				 <button type="button" class="btn btn-danger" onClick="delete_item('categories','<?php echo $datas['id'];?>','<?php echo $a;?>');"> <i class="fa fa-trash"></i></button>

                                    </td>
                                </tr>

																<?php
																	$resultss = mysql_query("SELECT * FROM products WHERE cat_id='$sub_id' ORDER BY id", $db);
																	$datass = mysql_fetch_array($resultss);
																		if($datass)do{ $a++;
																?>
								                                <tr id="<?php echo $a;?>">
								                                	<td style="width:40px;"><?php echo $a;?></td>
								                                    <td class="issue-info"><p style="margin-left:40px;"> - <?php echo $datass['title'];?></p></td>
								                                    <td class="text-right">
								                                         <a href="index.php?item=<?php echo $item?>&action=edit_product&id=<?php echo $datass['id'];?>" class="btn btn-info"> <i class="fa fa-pencil"></i></a>
																												 <button type="button" class="btn btn-danger" onClick="delete_item('products','<?php echo $datass['id'];?>','<?php echo $a;?>');"> <i class="fa fa-trash"></i></button>

								                                    </td>
								                                </tr>




<?php
} while($datass = mysql_fetch_array($resultss));
} while($datas = mysql_fetch_array($results));
} while($data = mysql_fetch_array($result));  ?>
                                </tbody>
                            </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


        </div>
<?php } ?>
