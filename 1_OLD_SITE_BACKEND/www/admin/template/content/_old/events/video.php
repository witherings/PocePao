<div id="page-wrapper" class="gray-bg">
        <div class="row border-bottom">

        </div>
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>Выступления</h2>
                    <ol class="breadcrumb">
                        <li>
                            <a href="index.php">Главная</a>
                        </li>
                        <li>
                            Выступления
                        </li>
                        <li class="active">
                            <strong>Видео</strong>
                        </li>
                    </ol>
                </div>
            </div>
<?php 
if(isset($_POST['add'])){
	$date=$_POST['date'];
	$text=$_POST['text'];
	$title=$_POST['title'];	
	$city=$_POST['city'];	
	if(mysql_query("INSERT INTO video (title, text, code) VALUES ('$title','$text','$code')", $db)){
		echo "<script>toastr.success('Новая запись успешно добавлена','Запись добавлена');</script>";
	}
} 

if(isset($_POST['edit'])){
	$text=$_POST['text'];
	$title=$_POST['title'];	
	if(mysql_query("UPDATE video SET title='$title', text='$text', code='$code' WHERE id='$edit'", $db)){
		echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";
	}
} 


if(isset($action)){include "template/content/events/$action.php";}else{?>
        <div class="wrapper wrapper-content  animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox">
                        <div class="ibox-title">
                            <h5>Видео</h5>
                             <div class="ibox-tools">
                                <a href="index.php?item=<?php echo $item?>&action=add-video" class="btn btn-primary "><i class="fa fa-plus"></i> Добавить видео</a>
                            </div>
                        </div>
                        <div class="ibox-content">

                            <div class="table-responsive">
                            <table class="table table-hover issue-tracker">
                                <tbody>
<?php
$a=0;
$result = mysql_query("SELECT * FROM video ORDER BY id", $db);
$data = mysql_fetch_array($result);
	if($data)do{ $a++;
	$title=$data['title'];
?>	
                                <tr id="<?php echo $data['id']?>">
                                	<td><?php echo $a;?></td>
                                    <td class="issue-info"><?php echo $title;?></td>
                                    <td class="text-right">
                                         <a href="index.php?item=<?php echo $item?>&action=edit-video&id=<?php echo $data['id']?>" class="btn btn-info"> <i class="fa fa-pencil"></i> Редактировать</a>
                                         <button type="button" class="btn btn-danger" onClick="delete_item('video',<?php echo $data['id']?>);"> <i class="fa fa-trash"></i> Удалить</button>
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


<?php include "template/files/footer.php"; ?>
</div>
