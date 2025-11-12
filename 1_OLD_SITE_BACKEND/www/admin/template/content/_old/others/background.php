<div id="page-wrapper" class="gray-bg">
        <div class="row border-bottom">

        </div>
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>Общее</h2>
                    <ol class="breadcrumb">
                        <li>
                            <a href="index.php">Главная</a>
                        </li>
                        <li class="active">
                            <strong>Фон сайта</strong>
                        </li>
                    </ol>
                </div>
            </div>
<?php 
if(isset($_POST['add'])){
	$type=$_POST['type'];
	$ord=$_POST['ord'];
	$title=$_POST['title'];	
	if(mysql_query("INSERT INTO backgrounds (title, type, ord) VALUES ('$title','$type','$ord')", $db)){
		echo "<script>toastr.success('Новая запись успешно добавлена','Запись добавлена');</script>";
	}
} 

if(isset($_POST['edit'])){
	$type=$_POST['type'];
	$ord=$_POST['ord'];
	$title=$_POST['title'];	
	if(mysql_query("UPDATE backgrounds SET title='$title', type='$type', ord='$ord' WHERE id='$edit'", $db)){
		echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";
	}
} 



if(isset($action)){include "template/content/others/$action.php";}else{?>
        <div class="wrapper wrapper-content  animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox">
                        <div class="ibox-title">
                            <h5>Список страниц</h5>
                        </div>
                        <div class="ibox-content">

                            <div class="table-responsive">
                            <table class="table table-hover issue-tracker">
                                <tbody>
<?php
$a=0;
$result = mysql_query("SELECT * FROM backgrounds ORDER BY id", $db);
$data = mysql_fetch_array($result);
	if($data)do{ $a++;
?>	
                                <tr id="<?php echo $data['id']?>">
                                	<td style="width:30px;"><?php echo $a;?></td>
                                    <td class="issue-info">
                                        <a href="#"><?php echo $data['title'];?></a>
                                    </td>
                                    <td class="text-right">
                                         <a href="index.php?item=<?php echo $item?>&action=page_bg&page=<?php echo $data['title']?>" class="btn btn-info"> <i class="fa fa-pencil"></i> Редактировать</a>
                                         <button type="button" class="btn btn-danger" onClick="delete_item('backgrounds',<?php echo $data['id']?>);"> <i class="fa fa-trash"></i> Удалить</button>
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
