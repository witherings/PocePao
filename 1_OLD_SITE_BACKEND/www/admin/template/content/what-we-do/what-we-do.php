<?php
if(isset($_POST['edit'])){
	$text_top=mysql_real_escape_string($_POST['text_top']);
	$title1=mysql_real_escape_string($_POST['title_1']);	
	$text1=mysql_real_escape_string($_POST['text_1']);
	$title2=mysql_real_escape_string($_POST['title_2']);	
	$text2=mysql_real_escape_string($_POST['text_2']);

 foreach($_POST as $key => $value) 
  { 
     if($key!='files' && $key!='edit' && $value!='<p><br></p>'){
	 	//echo "$key = $value <br />"; 
		if($value=='' || $value==' '){
			mysql_query("UPDATE what_we_do_$lang SET $key=NULL WHERE id='$edit'", $db);
		}else{
			$v=htmlspecialchars($value);
			mysql_query("UPDATE what_we_do_$lang SET $key='$v' WHERE id='$edit'", $db);
		}
	 }
  } 
  
  echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";
} 

$result = mysql_query("SELECT * FROM admin_menu_$lang WHERE link='$sub_link_name'", $db);
$data = mysql_fetch_array($result);
$id=$data['sub_link'];

$result = mysql_query("SELECT * FROM what_we_do_$lang WHERE id='$id'", $db);
$data = mysql_fetch_array($result);
$icons[]='no';
$icons[]=$data['ico1'];
$icons[]=$data['ico2'];
$icons[]=$data['ico3'];
$icons[]=$data['ico4'];
$icons[]=$data['ico5'];
$icons[]=$data['ico6'];
?>
        <div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">

                            <div class="tab-content">
                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                    
									<form action="index.php?item=<?php echo $_GET['item']; ?>" method="POST">
                                        <fieldset class="form-horizontal">
                                            
                                                                           
                                            <div class="form-group"><label class="col-sm-2 control-label">Заголовок:</label>
                                                <div class="col-sm-10"><input type="text" name="main_title1" class="form-control" value="<?php echo $data['main_title1'];?>"></div>
                                            </div>
        									
                                            
                                            <?php $x=0; while ($x++<6){ ?>
                                            <hr>
                                            <div class="form-group"><label class="col-sm-2 control-label">Пункт <?php echo $x; ?>:</label>
                                                <div class="col-sm-10"><input type="text" name="sub_title<?php echo $x; ?>" class="form-control" value="<?php echo $data['sub_title'.$x];?>"></div>
                                            </div>                                  
                                            <div class="form-group"><label class="col-sm-2 control-label">Иконка</label>
                                                <div class="col-sm-10">
                                                        <select class="form-control image_select_input" multiple="" name="ico<?php echo $x; ?>">
	                                                        <?php
															$results = mysql_query("SELECT * FROM icons WHERE item='$con[1]' ORDER BY id", $db);
															$datas = mysql_fetch_array($results);
															do{
															?>
                                                            <option value="<?php echo $datas['img'];?>" class="image_select" <?php if($icons[$x]==$datas['img']){echo 'selected';}?> style="background:url(../upload/icons/<?php echo $con[1].'/'.$datas['img'];?>) no-repeat center center;"></option>
                                                            <?php	} while($datas = mysql_fetch_array($results));  ?>                                                            
                                                        </select>
                                                </div>
                                            </div>
                                            <?php } ?>
                                            
                                            
                                            
                                            
                                            <div class="form-group"><label class="col-sm-2 control-label">Заголовок:</label>
                                                <div class="col-sm-10"><input type="text" name="main_title2" class="form-control" value="<?php echo $data['main_title2'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Пункт 1:</label>
                                                <div class="col-sm-10"><input type="text" name="title1" class="form-control" value="<?php echo $data['title1'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Пункт 2:</label>
                                                <div class="col-sm-10"><input type="text" name="title2" class="form-control" value="<?php echo $data['title2'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Пункт 3:</label>
                                                <div class="col-sm-10"><input type="text" name="title3" class="form-control" value="<?php echo $data['title3'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Пункт 4:</label>
                                                <div class="col-sm-10"><input type="text" name="title4" class="form-control" value="<?php echo $data['title4'];?>"></div>
                                            </div>
                                            <textarea class="summernote" name="text1"><?php echo $data['text1'];?></textarea>
                                            <br>
                                            <textarea class="summernote" name="text2"><?php echo $data['text2'];?></textarea>
                                            <br>
                                            <textarea class="summernote" name="text3"><?php echo $data['text3'];?></textarea>
                                            <br>
                                            <textarea class="summernote" name="text4"><?php echo $data['text4'];?></textarea>
                                            <br>
                                            
                                            <input type="hidden" name="edit" value="<?php echo $id; ?>">
                                            
                                            
                                        </fieldset>
                                        
                                        <input type="submit" class="btn btn-primary btn-lg" value="Сохранить">
                                        <a href="index.php?item=<?php echo $_GET['item']; ?>" class="btn btn-warning btn-lg">Обновить</a>
                                        <a href="index.php?item=<?php echo $_GET['item']; ?>" class="btn btn-default btn-lg">Отмена</a>
                                        </form>
                                        <br>   
                                        <a name="pic">
                                        <?php $img1="upload/what-we-do/".$data['img'].".jpg";?>
                                           <a href="index.php?item=others_cropper&type=<?php echo $_GET['item']; ?>&img=<?php echo $img1;?>"><img src="../upload/what-we-do/<?php echo $data['img']; ?>.jpg" height="100"></a>

                                   		
                                        

                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>

        </div>
        
