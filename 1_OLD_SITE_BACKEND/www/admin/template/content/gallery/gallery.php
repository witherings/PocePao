<?php
if(isset($_POST['edit'])){
		$id=$_POST['edit'];
		$title=$_POST['title'];
		$text=$_POST['text'];

	$query="UPDATE slider SET title='$title', text='$text' WHERE id='$id'";
	mysql_query($query, $db);


	if($_FILES["img"]){
  	$target_dir='../assets/images/slider/';

	$target_file = $target_dir . basename($_FILES["img"]["name"]);
	$uploadOk = 1;
	$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	$file_name= rand(100,1000).date("dmYHis") . '.' . $imageFileType;
	$new_file=$target_dir.$file_name;


	if ($uploadOk == 0) {
	  echo "<br>Файл не был загружен.<br>";
	} else {
	  if (move_uploaded_file($_FILES["img"]["tmp_name"], $new_file)) {
			mysql_query("UPDATE gallery SET img='$file_name' WHERE id='$id'", $db);
			echo "<script>toastr.success('Запись успешно сохранена','Запись добавлена');</script>";
	  } else {
		echo "Ошибка загрузки файла.<br>";
	  }
	}
}

}
//---------------------------------------------------------------------------------------------------------------------
if(isset($_POST['add'])){

		if($_FILES["img"]){



		$target_dir='../assets/images/gallary/';

		$target_file = $target_dir . basename($_FILES["img"]["name"]);
		$uploadOk = 1;
		$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
		$file_name= rand(100,1000).date("dmYHis") . '.' . $imageFileType;
		$new_file=$target_dir.$file_name;



		if ($uploadOk == 0) {
			echo "<br>Файл не был загружен.<br>";
		} else {
			if (move_uploaded_file($_FILES["img"]["tmp_name"], $new_file)) {
				mysql_query("INSERT INTO gallery (img) VALUES ('$file_name')", $db);
				echo "<script>toastr.success('Новая запись успешно добавлена','Запись добавлена');</script>";
			} else {
			echo "Ошибка загрузки файла.<br>";
			}
		}
	}
}



if(isset($action)){include "template/content/gallery/$action.php";}else{?>
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
                                <tr style="font-weight:bold;">
                                	<td style="width:40px;">#</td>
                                    <td class="issue-info">Заголовок</td>
                                    <td class="text-right">
                                         Действия
                                    </td>
                                </tr>
<?php
$a=0;
$result = mysql_query("SELECT * FROM gallery ORDER BY id", $db);
$data = mysql_fetch_array($result);
	if($data)do{ $a++;
?>
                                <tr id="<?php echo $data['id']?>">
                                	<td style="width:40px;"><?php echo $a;?></td>
                                    <td class="issue-info"><img src="../assets/images/gallary/<?php echo $data['img']?>" style="height:50px;" alt=""></td>
                                    <td class="text-right">
                                         <button type="button" class="btn btn-danger" onClick="delete_item('gallery','<?php echo $data['id']?>','<?php echo $data['id']?>');"> <i class="fa fa-trash"></i></button>
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
