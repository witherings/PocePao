<?php 
//---------------------------------------------------------------------------------------------------------------------
if(isset($_POST['add'])){
		$name=$_POST['name'];
		mysql_query("INSERT INTO dictionary_contacts_$lang (name) VALUES ('$name')", $db);
		$result = mysql_query("SELECT * FROM dictionary_contacts_$lang ORDER BY id DESC LIMIT 1", $db);
		$data = mysql_fetch_array($result);
		$id=$data['id'];
		
		foreach($_POST as $key => $value)
		  {
			  if($key!='add' && $key!='files')
			 //echo "$key = $value <br />";
			 mysql_query("UPDATE dictionary_contacts_$lang SET $key='$value' WHERE id='$id'", $db);
		  }
	
		echo "<script>toastr.success('Новая запись успешно добавлена','Запись добавлена');</script>";
} 

if(isset($_POST['edit'])){
	foreach($_POST as $key => $value)
  	{
	  if($key!='add' && $key!='files' && $key!='edit')
	  mysql_query("UPDATE dictionary_contacts_$lang SET $key='$value' WHERE id='$edit'", $db);
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
$result = mysql_query("SELECT * FROM regions_$lang ORDER BY name", $db);
$data = mysql_fetch_array($result);
	if($data)do{ $a++;
	$id_parent=$id=$data['id'];
?>	
                                <tr id="<?php echo $a;?>">
                                	<td style="width:40px;"><?php echo $a;?></td>
                                    <td class="issue-info" style="font-weight:bold;"><?php echo $data['name'];?></td>
                                    <td class="text-right">
                                         <a href="index.php?item=<?php echo $item?>&sub=<?php echo $_GET['sub'];?>&action=add_diler&id=<?php echo $data['id']?>&obl=<?php echo $data['name'];?>" class="btn btn-primary"> <i class="fa fa-plus"></i></a>
                                    </td>
                                </tr>
                                <?php
									$results = mysql_query("SELECT * FROM dictionary_contacts_$lang WHERE region='$id_parent' AND status='1' ORDER BY sort", $db);
									$datas = mysql_fetch_array($results);
										if($datas)do{ $a++; 
								?>	
                                <tr id="<?php echo $a;?>">
                                	<td style="width:40px;"><?php echo $a;?></td>
                                    <td class="issue-info" style="margin-left:30px;"><?php echo $datas['city'].' - '.$datas['name'].' ['.$datas['sort'].']';?></td>
                                    <td class="text-right">
                                         <a href="index.php?item=<?php echo $item?>&sub=<?php echo $_GET['sub'];?>&action=edit_diler&id=<?php echo $datas['id']?>&obl=<?php echo $data['name'];?>" class="btn btn-info"> <i class="fa fa-pencil"></i></a>
                                          <button type="button" class="btn btn-danger" onClick="delete_item('dictionary_contacts_<?php echo $lang;?>','<?php echo $datas['id']?>','<?php echo $a?>');"> <i class="fa fa-trash"></i></button>

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

