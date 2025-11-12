<?php 
//---------------------------------------------------------------------------------------------------------------------

if(isset($_POST['edit'])){
	foreach($_POST as $key => $value)
  	{
	  if($key!='add' && $key!='files' && $key!='edit')
	  mysql_query("UPDATE content_$lang SET $key='$value' WHERE id='$edit'", $db);
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
$a=0;
$query="SELECT * FROM content_$lang WHERE action='$item'";
$result = mysql_query($query, $db);
$data = mysql_fetch_array($result);
	if($data)do{ $a++;
	$id_parent=$id=$data['id'];
?>	
                                <tr id="<?php echo $a;?>">
                                	<td style="width:40px;"><?php echo $a;?></td>
                                    <td class="issue-info" style="font-weight:bold;"><?php echo $data['name'];?></td>
                                    <td class="text-right">
                                         <a href="index.php?item=<?php echo $item?>&action=edit_content&id=<?php echo $data['id']?>" class="btn btn-info"> <i class="fa fa-pencil"></i></a>
                                    </td>
                                </tr>
                                <?php
									$results = mysql_query("SELECT * FROM content_$lang WHERE id_parent='$id_parent' ORDER BY sort", $db);
									$datas = mysql_fetch_array($results);
										if($datas)do{ $a++;
								?>	
                                <tr id="<?php echo $a;?>">
                                	<td style="width:40px;"><?php echo $a;?></td>
                                    <td class="issue-info" style="margin-left:30px;"> - <?php echo $datas['name'];?></td>
                                    <td class="text-right">
                                         <a href="index.php?item=<?php echo $item?>&action=edit_content&id=<?php echo $datas['id']?>" class="btn btn-info"> <i class="fa fa-pencil"></i></a>

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

