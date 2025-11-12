<?php
if(isset($_POST['add'])){
	$title=$_POST['title'];
	$text=$_POST['text'];
			if($lang=='ua'){$query="INSERT INTO ways (title_ua, text_ua) VALUES ('$title','$text')";}
			else if($lang=='en'){$query="INSERT INTO ways (title_en, text_en) VALUES ('$title','$text')";}
			mysql_query($query, $db);
			echo "<script>toastr.success('Новая запись успешно добавлена','Запись добавлена');</script>";
}


if(isset($_POST['edit'])){
		$id=$_POST['edit'];
		$title=$_POST['title'];
		$text=$_POST['text'];
		$text = htmlentities($text, ENT_QUOTES, 'UTF-8');

	if($lang=='ua'){$query="UPDATE ways SET title_ua='$title', text_ua='$text' WHERE id='$id'";}
	else if($lang=='en'){$query="UPDATE ways SET title_en='$title', text_en='$text' WHERE id='$id'";}
	mysql_query($query, $db);
}

if(isset($action)){include "template/content/ways/$action.php";}else{?>

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
                                    <td class="issue-info">Название</td>

                                    <td class="text-right">
                                         Действия
                                    </td>
                                </tr>
<?php
$a=0;
$result = mysql_query("SELECT * FROM ways ORDER BY id DESC", $db);
$data = mysql_fetch_array($result);
	if($data)do{ $a++;
?>
                                <tr id="<?php echo $data['id']?>">
                                	<td style="width:40px;"><?php echo $a;?></td>
                                    <td class="issue-info"><?php echo $data['title_ua'];?></td>
                                    <td class="text-right">
                                         <a href="index.php?item=<?php echo $item?>&action=edit&id=<?php echo $data['id']?>" class="btn btn-info"> <i class="fa fa-pencil"></i></a>
                                         <button type="button" class="btn btn-danger" onClick="delete_item('ways','<?php echo $data['id']?>','<?php echo $data['id']?>');"> <i class="fa fa-trash"></i></button>
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
