<?php 
//---------------------------------------------------------------------------------------------------------------------

if(isset($_POST['edit_diler_user'])){
	$edit=$_POST['edit_diler_user'];
	foreach($_POST as $key => $value)
  	{
	  if($key!='add' && $key!='files' && $key!='edit')
	  mysql_query("UPDATE reklamaciya SET $key='$value' WHERE id='$edit'", $db);
  	}
	echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";	
} 


//---------------------------------------------------------------------------------------------------------------------
if(isset($action)){include "template/content/$item/$action.php";}else{?>

<style>
.nonactive{ font-style:italic; color:rgba(197,197,197,1.00);}
</style>
        <div class="wrapper wrapper-content  animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox">
                        <div class="ibox-title">
                            <h5>Список</h5>
                        </div>
                        <div class="ibox-content">

                            <div class="table-responsive">
                            <table class="table table-hover issue-tracker">
                                <tbody>
<?php
$result = mysql_query("SELECT * FROM reklamaciya ORDER BY id", $db);
$data = mysql_fetch_array($result);
$a=0;
if($data)do{
	$a++;
	$id=$data['id'];
	$text=html_entity_decode($data['text']);
?>	
                                <tr id="<?php echo $a;?>">
                                	<td style="width:40px;"><?php echo $a;?></td>
                                    <td style="width:300px;" class="issue-info"><?php echo $text;?></td>
                                    <td style="width:200px;" class="issue-info"><?php echo $data['date'];?></td>
                                    <td style="width:100px;" class="issue-info"><?php echo $data['user'];?></td>
                                    <td class="text-right">
                                         <button type="button" class="btn btn-danger" onClick="delete_item('reklamaciya','<?php echo $data['id']?>','<?php echo $a?>');"> <i class="fa fa-trash"></i></button>
                                    </td>
                                </tr>
                               
<?php	
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

