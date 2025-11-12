<?php
if(isset($_POST['edit'])){
		$id=$_POST['edit'];
		$title1=$_POST['title1'];
    $title2=$_POST['title2'];
		$link=$_POST['link'];

	$query="UPDATE banners SET title1='$title1', title2='$title2', link='$link' WHERE id='$id'";
	mysql_query($query, $db);


	if($_FILES["img"]){
  	$target_dir='../assets/images/demos/demo3/categories/';

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
			mysql_query("UPDATE banners SET img='$file_name' WHERE id='$id'", $db);
			echo "<script>toastr.success('Запись успешно сохранена','Запись добавлена');</script>";
	  } else {
		echo "Ошибка загрузки файла.<br>";
	  }
	}
}

}
//---------------------------------------------------------------------------------------------------------------------
?>
        <div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">
                            <div class="tab-content">

															<form action="index.php?item=<?php echo $item; ?>&sub=<?php echo $_GET['sub']; ?>" method="POST" enctype="multipart/form-data">
                                <div id="tab-1" class="tab-pane active">
                                  <div class="panel-body">

                                    <?php
                                    if($_GET['sub']=='5'){$id=1;}else if($_GET['sub']=='6'){$id=2;}
									$result = mysql_query("SELECT * FROM slider ORDER BY id", $db);
									$data = mysql_fetch_array($result);
									?>


                                      <fieldset class="form-horizontal">
                                        <div class="form-group"><label class="col-sm-2 control-label">Заголовок 1:</label>
                                              <div class="col-sm-10"><input type="text" name="title1" class="form-control" value="<?php echo $data['title1'];?>"></div>
                                          </div>
                                          <div class="form-group"><label class="col-sm-2 control-label">Заголовок 2:</label>
                                              <div class="col-sm-10"><input type="text" name="title2" class="form-control" value="<?php echo $data['title2'];?>"></div>
                                          </div>
                                          <div class="form-group"><label class="col-sm-2 control-label">Ссылка:</label>
                                              <div class="col-sm-10"><input type="text" name="link" class="form-control" value="<?php echo $data['link'];?>"></div>
                                          </div>

                                          <div class="form-group">
                                            <label class="col-sm-2 control-label">Фото [610 x 200]:</label>
                                              <div class="col-sm-10">
                                                <img src="../assets/images/demos/demo3/categories/<?php echo $data['img'];?>" width="400"><br><br>
                                                <input type="file" name="img" id="photos"></div>
                                          </div>

                                          <input type="hidden" name="edit" value="<?php echo $id; ?>">
                                      </fieldset>


                                  </div>
                                </div>


																<br>
																<input type="submit" class="btn btn-primary btn-lg" value="Сохранить">
																<a href="index.php?item=<?php echo $item; ?>" class="btn btn-default btn-lg">Отмена</a>
														 </form>
                            </div>
                    </div>
                </div>
            </div>

        </div>
