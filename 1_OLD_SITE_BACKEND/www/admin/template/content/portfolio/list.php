<?php
$sub=$_GET['sub'];
if($sub=='12'){$type='logos';}
if($sub=='13'){$type='sites';}
if($sub=='14'){$type='animations';}
if($sub=='15'){$type='poly';}
if($sub=='16'){$type='video';}
if($sub=='17'){$type='outdoor';}

//--------------------------------------------------------------------------------------------------------------------------
if(isset($_GET['home'])){
	$id=$_GET['home'];

	$home=1;
	$result = mysql_query("SELECT * FROM portfolio WHERE id='$id'", $db);
	$data = mysql_fetch_array($result);
	$h=$data['home'];
	if($h=='1'){$home=0;}

	 mysql_query("UPDATE portfolio SET home='$home' WHERE id='$id'", $db);
	 	echo "<script>toastr.success('Новая запись успешно добавлена','Запись добавлена');</script>";
}
//--------------------------------------------------------------------------------------------------------------------------
if(isset($_POST['add'])){

	$title=$_POST['title'];
	$home=$_POST['home'];
	if($home!=''){$home=1;}else{$home=0;}
	$target_dir='../assets/imgs/portfolio/';

	$target_file = $target_dir . basename($_FILES["img_prev"]["name"]);
	$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	$file_name_prev= date("YmdHis").rand(0,100).'.'.$imageFileType;
		$new_file_prev=$target_dir.$file_name_prev;
		move_uploaded_file($_FILES["img_prev"]["tmp_name"], $new_file_prev);

if($type=='animations' || $type=='video'){
			$link=$_POST['link'];
			$query="INSERT INTO portfolio (type, title, img_prev, img_big, link, home) VALUES ('$type','$title','$file_name_prev','$file_name_big','$link','$home')";
}else{
	$target_file = $target_dir . basename($_FILES["img_big"]["name"]);
	$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	$file_name_big= date("YmdHis").rand(0,100).'.'.$imageFileType;
		$new_file_big=$target_dir.$file_name_big;
		move_uploaded_file($_FILES["img_big"]["tmp_name"], $new_file_big);
		$query="INSERT INTO portfolio (type, title, img_prev, img_big, home) VALUES ('$type','$title','$file_name_prev','$file_name_big','$home')";
}
			mysql_query($query, $db);
			//echo $query;
			echo "<script>toastr.success('Новая запись успешно добавлена','Запись добавлена');</script>";

}

//--------------------------------------------------------------------------------------------------------------------------



if(isset($action)){include "template/content/portfolio/$action.php";}else{?>

        <div class="wrapper wrapper-content  animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox">
                        <div class="ibox-title">
                            <h5>Список</h5>
                            <div class="ibox-tools">
                                <a href="index.php?item=<?php echo $item?>&action=add&sub=<?php echo $_GET['sub']; ?>" class="btn btn-primary "><i class="fa fa-plus"></i> Добавить</a>
                            </div>
                        </div>
                        <div class="ibox-content">

                            <div class="table-responsive">
                            <table class="table table-hover issue-tracker">
                                <tbody>
                                <tr style="font-weight:bold;">
                                	<td style="width:40px;">#</td>
																		<td>Фото</td>
																		<td class="issue-info">Заголовок</td>
																		<td>На главной</td>

                                    <td class="text-right">
                                         Действия
                                    </td>
                                </tr>
<?php
$a=0;
$result = mysql_query("SELECT * FROM portfolio WHERE type='$type' ORDER BY id", $db);
$data = mysql_fetch_array($result);
	if($data)do{ $a++;
		$home=$data['home'];
		if($home=='1'){$class='danger';}else{$class='info';}
?>
                                <tr id="<?php echo $data['id']?>">
                                	<td><?php echo $a;?></td>
																	  <td	><img src="../assets/imgs/portfolio/<?php echo $data['img_prev'];?>" style="width:100px;"></td>
																		<td class="issue-info"><?php echo $data['title'];?></td>
																		<td><?php if($home=='1'){echo "<i class='fa fa-home'></i>";} ?></td>
                                    <td class="text-right">
																			   <a href="index.php?item=<?php echo $item?>&sub=<?php echo $_GET['sub']?>&home=<?php echo $data['id']?>" class="btn btn-<?php echo $class; ?>"> <i class="fa fa-home"></i></a>
                                         <button type="button" class="btn btn-danger" onClick="delete_item('portfolio','<?php echo $data['id']?>','<?php echo $data['id']?>');"> <i class="fa fa-trash"></i></button>
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
