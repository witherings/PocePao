<?php 
//---------------------------------------------------------------------------------------------------------------------

if(isset($_POST['edit_diler_files_group'])){
	$edit=$_POST['edit_diler_files_group'];
	foreach($_POST as $key => $value)
  	{
	  if($key!='add' && $key!='files' && $key!='edit')
	  mysql_query("UPDATE users_file_group_$lang SET $key='$value' WHERE id='$edit'", $db);
  	}
	echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";	
} 

//---------------------------------------------------------------------------------------------------------------------

if(isset($_POST['edit_diler_file'])){
	$edit=$_POST['edit_diler_file'];
	foreach($_POST as $key => $value)
  	{
	 // echo "$key - $value <br>";
	  if($key!='add' && $key!='files' && $key!='edit')
	  mysql_query("UPDATE users_file_$lang SET $key='$value' WHERE id='$edit'", $db);
  	}
	
	
	if($_FILES["photo"]){
  		$target_dir='../files/users/';
	
		$new_file = $target_dir . basename($_FILES["photo"]["name"]);
		$file_name = basename($_FILES["photo"]["name"]);
	
	  if (move_uploaded_file($_FILES["photo"]["tmp_name"], $new_file)) {
		//mysql_query("INSERT INTO catalog_images_$lang (image, goods_id) VALUES ('$file_name','$goods_id')", $db);
		 mysql_query("UPDATE users_file_$lang SET filename='$file_name' WHERE id='$edit'", $db);
	  } else {
		echo "Ошибка загрузки файла.<br>";
	  }
	}
	
	
	
	echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";	
}


if(isset($_POST['add_diler_file'])){
	$name=$_POST['name'];
	mysql_query("INSERT INTO users_file_$lang (name) VALUES ('$name')", $db);
	$result = mysql_query("SELECT * FROM users_file_$lang ORDER BY id DESC LIMIT 1", $db);
	$data = mysql_fetch_array($result);
	$id=$data['id'];
	
	foreach($_POST as $key => $value)
  	{
	 // echo "$key - $value <br>";
	  if($key!='add' && $key!='files' && $key!='edit')
	  mysql_query("UPDATE users_file_$lang SET $key='$value' WHERE id='$id'", $db);
  	}
	
	
	if($_FILES["photo"]){
  		$target_dir='../files/users/';
	
		$new_file = $target_dir . basename($_FILES["photo"]["name"]);
		$file_name = basename($_FILES["photo"]["name"]);
	
	  if (move_uploaded_file($_FILES["photo"]["tmp_name"], $new_file)) {
		mysql_query("UPDATE users_file_$lang SET filename='$file_name' WHERE id='$id'", $db);
	  } else {
		echo "Ошибка загрузки файла.<br>";
	  }
	}
	
	
	
	echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";	
}  

//---------------------------------------------------------------------------------------------------------------------
if(isset($action)){include "template/content/$item/$action.php";}else{?>

<style>
.nonactive{ font-style:italic; color:rgba(197,197,197,1.00);}
</style>

<?php
if($_GET['show']){
	$show=$_GET['show'];
	if($show=='diler'){$class='btn-outline';}else{$class='';}
	if($show=='diler2'){$class2='btn-outline';}else{$class2='';}
}else{$class0='btn-outline';}
?>
        <div class="wrapper wrapper-content  animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox">
                        <div class="ibox-title" style="overflow:auto;">
                            <div style="float:left;">
                            <a href="index.php?item=<?php echo $item?>&sub=<?php echo $_GET['sub'];?>" class="btn <?php echo $class0;?> btn-success">Все</a>
                            <a href="index.php?item=<?php echo $item?>&sub=<?php echo $_GET['sub'];?>&show=diler" class="btn <?php echo $class;?> btn-primary">Херсон</a>
                            <a href="index.php?item=<?php echo $item?>&sub=<?php echo $_GET['sub'];?>&show=diler2" class="btn <?php echo $class2;?> btn-info">Белая Церковь</a>
                            </div>
                            <div class="ibox-tools" style="float:right; display:none;">
                                <a href="index.php?item=<?php echo $item?>&action=add" class="btn btn-primary "><i class="fa fa-plus"></i> Добавить</a>
                            </div>
                        </div>
                        <div class="ibox-content">

                            <div class="table-responsive">
                            <table class="table table-hover issue-tracker">
                                <tbody>
                                <tr style="font-weight:bold;">
                                	<td>#</td>
                                    <td>Название</td>
                                    <td>Сортировка</td>
                                    <td colspan="2">Видимость</td>
                                    <td style="text-align:right;">Действия</td>
                                    
                                </tr>
<?php
$result = mysql_query("SELECT * FROM users_file_group_$lang WHERE status=1 ORDER BY sort", $db);
$data = mysql_fetch_array($result);
$a=0;
if($data)do{
	$a++;
	$id=$data['id'];
	$name=$data['name'];
?>	
                                <tr id="<?php echo $a;?>">
                                	<td style="width:40px;"><?php echo $a;?></td>
                                    <td class="issue-info" style="font-weight:bold;"><?php echo $data['name'];?></td>
                                    <td colspan="3"><?php echo $data['sort'];?></td>
                                    <td class="text-right">
                                         <a href="index.php?item=<?php echo $item?>&sub=<?php echo $_GET['sub'];?>&action=add_diler_file&type=<?php echo $data['id']?>" class="btn btn-primary"> <i class="fa fa-plus"></i></a>
                                         <a href="index.php?item=<?php echo $item?>&sub=<?php echo $_GET['sub'];?>&action=edit_diler_files_group&id=<?php echo $data['id']?>" class="btn btn-info"> <i class="fa fa-pencil"></i></a>
                                    </td>
                                </tr>
                                <?php
									if($_GET['show']){
										$show=$_GET['show'];
										$query="SELECT * FROM users_file_$lang WHERE type='$id' AND $show='1' ORDER BY sort";
									}else{
										$query="SELECT * FROM users_file_$lang WHERE type='$id' ORDER BY sort";
									}
									$results = mysql_query($query, $db);
									$datas = mysql_fetch_array($results);
									if($datas)do{
										$a++;
										$id=$datas['id'];
										$name=$datas['name'];
										$filename=$datas['filename'];
										if($datas['diler']=='1'){$diler='Херсон';}else{$diler='';}
										if($datas['diler2']=='1'){$diler2='Белая Церковь';}else{$diler2='';}
										
										if($_GET['show']){
											if($show=='diler'){$diler2='';}
											else if($show=='diler2'){$diler='';}
										}
								?>
                                <tr id="<?php echo $a;?>">
                                	<td style="width:40px;"><?php echo $a;?></td>
                                    <td class="issue-info" style="margin-left:30px;"> - <a href="../files/users/<?php echo $filename;?>" style="font-weight:normal;" target="_blank"><?php echo $name;?></a></td>
                                    <td><?php echo $datas['sort'];?></td>
                                    <td><?php echo $diler;?></td>
                                    <td><?php echo $diler2;?></td>
                                    <td class="text-right">
                                         <a href="index.php?item=<?php echo $item?>&sub=<?php echo $_GET['sub'];?>&action=edit_diler_file&id=<?php echo $datas['id']?>" class="btn btn-info"> <i class="fa fa-pencil"></i></a>
                                         <button type="button" class="btn btn-danger" onClick="delete_item('users_file_<?php echo $lang;?>','<?php echo $datas['id']?>','<?php echo $a?>');"> <i class="fa fa-trash"></i></button>
                                    </td>
                                </tr>
                                
                                
                                
                                
<?php	
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

