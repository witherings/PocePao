<div id="page-wrapper" class="gray-bg">
        <div class="row border-bottom">

        </div>
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>Профайл</h2>
                    <ol class="breadcrumb">
                        <li>
                            <a href="index.php">Главная</a>
                        </li>
                        <li class="active">
                            <strong>Профайл</strong>
                        </li>
                    </ol>
                </div>
            </div>
<?php 

if(isset($_POST['edit'])){
	$text=$_POST['text'];
	$title=$_POST['title'];	
	if(mysql_query("UPDATE profile SET title='$title', text='$text' WHERE id='$edit'", $db)){
		echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";
	}
} 


if(isset($action)){include "template/content/index/$action.php";}else{?>
        <div class="wrapper wrapper-content  animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox">
                        <div class="ibox-title">
                            <h5>Профайл</h5>
                        </div>
                        <div class="ibox-content">

                            <div class="table-responsive">
                            <table class="table table-hover issue-tracker">
                                <tbody>
<?php
$a=0;
$result = mysql_query("SELECT * FROM profile ORDER BY id", $db);
$data = mysql_fetch_array($result);
	if($data)do{ $a++;
?>	
                                <tr id="<?php echo $data['id']?>">
                                	<td><?php echo $a;?></td>
                                    <td class="issue-info"><?php echo $data['title'];?></td>
                                    <td class="text-right">
                                         <a href="index.php?item=<?php echo $item?>&action=profile_pic&id=<?php echo $data['id']?>" class="btn btn-success"> <i class="fa fa-upload"></i> Фото на главной</a>
                                         <a href="index.php?item=<?php echo $item?>&action=pics&id=<?php echo $data['id']?>" class="btn btn-success"> <i class="fa fa-upload"></i> Фото подробные</a>
                                         <a href="index.php?item=<?php echo $item?>&action=edit&id=<?php echo $data['id']?>" class="btn btn-info"> <i class="fa fa-pencil"></i> Редактировать</a>
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
