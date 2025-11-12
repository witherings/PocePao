<?php 
if(isset($_POST['add'])){
	mysql_query("INSERT INTO events_$lang (type) VALUES ('1')", $db);
	$result = mysql_query("SELECT id FROM events_$lang ORDER BY id DESC LIMIT 1", $db);
	$data = mysql_fetch_array($result);
	$id=$data['id'];
	
	foreach($_POST as $key => $value) 
  { 
     if($key!='files' && $key!='add' && $value!='<p><br></p>' && $value!='' && $value!=' '){
	 	//echo "$key = $value <br />"; 
		mysql_query("UPDATE events_$lang SET $key='$value' WHERE id='$id'", $db);
	 }
  } 
  echo "<script>toastr.success('Новая запись успешно добавлена','Запись добавлена');</script>";
  
	
} 


if(isset($action)){include "template/content/calendar/$action.php";}else{?>
        <div class="wrapper wrapper-content  animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox">
                        <div class="ibox-title">
                            <h5>Список событий</h5>
                            <div class="ibox-tools">
                                <a href="index.php?item=<?php echo $item?>&action=add" class="btn btn-primary "><i class="fa fa-plus"></i> Добавить событие</a>
                            </div>
                        </div>
                        <div class="ibox-content">

                            <div class="table-responsive">
                            <table class="table table-hover issue-tracker">
                                <tbody>
<?php
$a=0;
$result = mysql_query("SELECT * FROM events_$lang ORDER BY date DESC", $db);
$data = mysql_fetch_array($result);
	if($data)do{ $a++;
?>	
                                <tr id="<?php echo $data['id']?>">
                                	<td><?php echo $a;?></td>
                                    <td class="issue-info"><?php echo $data['title'];?></td>
                                    <td><?php echo $data['date'];?></td>
                                    <td class="text-right">
                                    	 <?php $img="upload/calendar/".$data['img'].".jpg";?>
                                         <a href="index.php?item=others_cropper&type=<?php echo $_GET['item']; ?>-item&img=<?php echo $img; ?>&id=<?php echo $data['id'];?>" class="btn btn-success"> <i class="fa fa-upload"></i> Фото</a>
                                         <a href="index.php?item=<?php echo $item?>&action=edit&id=<?php echo $data['id']?>" class="btn btn-info"> <i class="fa fa-pencil"></i> Редактировать</a>
                                         <button type="button" class="btn btn-danger" onClick="delete_item('events_<?php echo $lang;?>','<?php echo $data['id']?>');"> <i class="fa fa-trash"></i> Удалить</button>
                                    </td>
                                </tr>
<?php	} while($data = mysql_fetch_array($result));  ?>
                                </tbody>
                            </table>
                            
                            
                            </div>
                            
                        </div>


                    </div>
                    
                    <div class="tabs-container">

                            <div class="tab-content">
                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">

                                        <?php $img1="upload/calendar/2.jpg";?>
                                           <a href="index.php?item=others_cropper&type=<?php echo $_GET['item']; ?>&img=<?php echo $img1;?>"><img src="../upload/calendar/2.jpg" height="100"></a>

                                        

                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>


        </div>
        
        
<?php } ?>        

