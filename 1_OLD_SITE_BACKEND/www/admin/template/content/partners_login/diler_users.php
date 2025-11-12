<?php 
//---------------------------------------------------------------------------------------------------------------------

if(isset($_POST['edit_diler_user'])){
	$edit=$_POST['edit_diler_user'];
	foreach($_POST as $key => $value)
  	{
	  if($key!='add' && $key!='files' && $key!='edit')
	  mysql_query("UPDATE diler_users SET $key='$value' WHERE id='$edit'", $db);
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
$result = mysql_query("SELECT * FROM diler_users ORDER BY id", $db);
$data = mysql_fetch_array($result);
$a=0;
if($data)do{
	$a++;
	$id=$data['id'];
?>	
                                <tr id="<?php echo $a;?>">
                                	<td style="width:40px;"><?php echo $a;?></td>
                                    <td style="width:100px;" class="issue-info"><?php echo $data['login'];?></td>
                                    <td style="width:100px;" class="issue-info"><?php echo $data['password'];?></td>
                                    <td style="width:100px;" class="issue-info"><?php echo $data['mail'];?></td>
                                    <td class="text-right">
                                         <a href="index.php?item=<?php echo $item?>&sub=<?php echo $_GET['sub'];?>&action=edit_diler_user&id=<?php echo $data['id']?>" class="btn btn-info"> <i class="fa fa-pencil"></i></a>
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

