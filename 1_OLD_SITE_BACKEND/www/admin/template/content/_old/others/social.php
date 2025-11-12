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
                            <strong>Ссылки соц.сетей</strong>
                        </li>
                    </ol>
                </div>
            </div>
<?php 

if(isset($_POST['edit'])){
	$text=$_POST['text'];
	if(mysql_query("UPDATE social SET text='$text' WHERE id='$edit'", $db)){
		echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";
	}
} 


if(isset($action)){include "template/content/others/$action.php";}else{?>
        <div class="wrapper wrapper-content  animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox">
                        <div class="ibox-title">
                            <h5>Ссылки соц.сетей</h5>
                        </div>
                        <div class="ibox-content">

                            <div class="table-responsive">
                            <table class="table table-hover issue-tracker">
                                <tbody>
<?php
$a=0;
$result = mysql_query("SELECT * FROM social ORDER BY id", $db);
$data = mysql_fetch_array($result);
	if($data)do{ $a++;
	$title=$data['title'];
?>	
                                <tr id="<?php echo $data['id']?>">
                                	<td><?php echo $a;?></td>
                                    <td class="issue-info"><?php echo $title;?></td>
                                    <td class="text-right">
                                         <a href="index.php?item=<?php echo $item?>&action=edit&id=<?php echo $data['id']?>" class="btn btn-info"> <i class="fa fa-pencil"></i> Редактировать</a>
                                         <button type="button" class="btn btn-danger" onClick="delete_item('social',<?php echo $data['id']?>);"> <i class="fa fa-trash"></i> Удалить</button>
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
