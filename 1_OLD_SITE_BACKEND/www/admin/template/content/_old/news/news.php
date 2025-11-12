<div id="page-wrapper" class="gray-bg">
        <div class="row border-bottom">

        </div>
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>Новости</h2>
                    <ol class="breadcrumb">
                        <li>
                            <a href="index.php">Главная</a>
                        </li>
                        <li class="active">
                            <strong>Новости</strong>
                        </li>
                    </ol>
                </div>
            </div>
<?php 
if(isset($_POST['add'])){
	$date=$_POST['date'];
	$long_text=$_POST['long_text'];
	$title=$_POST['title'];	
	$city=$_POST['city'];	
	if(mysql_query("INSERT INTO news (date, title, long_text, city) VALUES ('$date','$title','$long_text','$city')", $db)){
		echo "<script>toastr.success('Новая запись успешно добавлена','Запись добавлена');</script>";
	}
} 

if(isset($_POST['edit'])){
	$date=$_POST['date'];
	$long_text=$_POST['long_text'];
	$title=$_POST['title'];	
	$city=$_POST['city'];		
	if(mysql_query("UPDATE news SET title='$title', date='$date', long_text='$long_text', city='$city' WHERE id='$edit'", $db)){
		echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";
	}
} 



if(isset($action)){include "template/content/news/$action.php";}else{?>
        <div class="wrapper wrapper-content  animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox">
                        <div class="ibox-title">
                            <h5>Список новостей</h5>
                            <div class="ibox-tools">
                                <a href="index.php?item=<?php echo $item?>&action=add" class="btn btn-primary "><i class="fa fa-plus"></i> Добавить новость</a>
                            </div>
                        </div>
                        <div class="ibox-content">

                            <div class="table-responsive">
                            <table class="table table-hover issue-tracker">
                                <tbody>
<?php
$a=0;
$result = mysql_query("SELECT * FROM news ORDER BY date DESC", $db);
$data = mysql_fetch_array($result);
	if($data)do{ $a++;
?>	
                                <tr id="<?php echo $data['id']?>">
                                	<td><?php echo $a;?></td>
                                    <td class="issue-info">
                                        <a href="#"><?php echo $data['title'];?></a>
                                    </td>
                                    <td><?php echo $data['city'];?></td>
                                    <td><?php echo $data['date'];?></td>
                                    <td class="text-right">
                                         <a href="index.php?item=<?php echo $item?>&action=pics&id=<?php echo $data['id']?>" class="btn btn-success"> <i class="fa fa-upload"></i> Фото</a>
                                         <a href="index.php?item=<?php echo $item?>&action=edit&id=<?php echo $data['id']?>" class="btn btn-info"> <i class="fa fa-pencil"></i> Редактировать</a>
                                         <button type="button" class="btn btn-danger" onClick="delete_item('news',<?php echo $data['id']?>);"> <i class="fa fa-trash"></i> Удалить</button>
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
