<?php
if(isset($_POST['edit'])){
	$text_top=$_POST['text_top'];
	$title1=$_POST['title_1'];	
	$text1=$_POST['text_1'];
	$title2=$_POST['title_2'];	
	$text2=$_POST['text_2'];

 foreach($_POST as $key => $value) 
  { 
     if($key!='files' && $key!='edit' && $value!='<p><br></p>' && $value!='' && $value!=' '){
	 	//echo "$key = $value <br />"; 
			mysql_query("UPDATE events_$lang SET $key='$value' WHERE id='$edit'", $db);
	 }
  } 
  
  echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";
} 

/*
$result = mysql_query("SELECT * FROM admin_menu_$lang WHERE link='$sub_link_name'", $db);
$data = mysql_fetch_array($result);
$id=$data['sub_link'];
*/

/*
-type
-title
-date
-anons
-text
-city
-days
-price
-link
-stitle1
-stitle2
-text1
-text2
-text3
-stitle3
-text4
-text5
-text6
-text7
-ico1
-ico2
-ico3
-ico4
-title7
-title8
day1
day2
day3
day4
day5
day1_text
day2_text
day3_text
day4_text
day5_text
*/

$result = mysql_query("SELECT * FROM events_$lang WHERE id='$id'", $db);
$data = mysql_fetch_array($result);
$icons[]='no';
$icons[]=$data['ico1'];
$icons[]=$data['ico2'];
$icons[]=$data['ico3'];
$icons[]=$data['ico4'];


?>
        <div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">

                            <div class="tab-content">
                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                    
									<form action="index.php?item=<?php echo $_GET['item']; ?>&action=edit&id=<?php echo $_GET['id']; ?>" method="POST">
                                        <fieldset class="form-horizontal">
                                            
                                            <div class="form-group"><label class="col-sm-1 control-label">Тип:</label>
                                                <div class="col-sm-11">
                                                <select name="type">
                                                	<option value="курс" <?php if($data['type']=='курс'){echo 'selcted';}?>>курс</option>
                                                    <option value="дегустация" <?php if($data['type']=='дегустация'){echo 'selected';}?>>дегустация</option>
                                                    <option value="лекция" <?php if($data['type']=='лекция'){echo 'selcted';}?>>лекция</option>
                                                </select>
                                                </div>
                                            </div>    
                                                                      
                                            <div class="form-group"><label class="col-sm-1 control-label">Заголовок:</label>
                                                <div class="col-sm-11"><input type="text" name="title" class="form-control" value="<?php echo $data['title'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Дата:</label>
                                                <div class="col-sm-11"><input type="text" name="date" class="form-control" value="<?php echo $data['date'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Анонс:</label>
                                                <div class="col-sm-11"><input type="text" name="anons" class="form-control" value="<?php echo $data['anons'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Город:</label>
                                                <div class="col-sm-11"><input type="text" name="city" class="form-control" value="<?php echo $data['city'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Кол-во дней:</label>
                                                <div class="col-sm-11"><input type="text" name="days" class="form-control" value="<?php echo $data['days'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Стоимость:</label>
                                                <div class="col-sm-11"><input type="text" name="price" class="form-control" value="<?php echo $data['price'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Ссылка:</label>
                                                <div class="col-sm-11"><input type="text" name="link" class="form-control" value="<?php echo $data['link'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Заголовок:</label>
                                                <div class="col-sm-11"><input type="text" name="stitle1" class="form-control" value="<?php echo $data['stitle1'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Заголовок:</label>
                                                <div class="col-sm-11"><input type="text" name="stitle2" class="form-control" value="<?php echo $data['stitle2'];?>"></div>
                                            </div>
                                             <div class="form-group"><label class="col-sm-1 control-label">Текст:</label>
                                                <div class="col-sm-11"><textarea class="summernote" name="text1"><?php echo $data['text1'];?></textarea></div>
                                            </div>
                                             <div class="form-group"><label class="col-sm-1 control-label">Текст:</label>
                                                <div class="col-sm-11"><textarea class="summernote" name="text2"><?php echo $data['text2'];?></textarea></div>
                                            </div>
                                             <div class="form-group"><label class="col-sm-1 control-label">Текст:</label>
                                                <div class="col-sm-11"><textarea class="summernote" name="text3"><?php echo $data['text3'];?></textarea></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Заголовок:</label>
                                                <div class="col-sm-11"><input type="text" name="stitle3" class="form-control" value="<?php echo $data['stitle3'];?>"></div>
                                            </div>
                                             <div class="form-group"><label class="col-sm-1 control-label">Текст:</label>
                                                <div class="col-sm-11"><textarea class="summernote" name="text4"><?php echo $data['text4'];?></textarea></div>
                                            </div>
                                             <div class="form-group"><label class="col-sm-1 control-label">Текст:</label>
                                                <div class="col-sm-11"><textarea class="summernote" name="text5"><?php echo $data['text5'];?></textarea></div>
                                            </div>
                                             <div class="form-group"><label class="col-sm-1 control-label">Текст:</label>
                                                <div class="col-sm-11"><textarea class="summernote" name="text6"><?php echo $data['text6'];?></textarea></div>
                                            </div>
                                             <div class="form-group"><label class="col-sm-1 control-label">Текст:</label>
                                                <div class="col-sm-11"><textarea class="summernote" name="text7"><?php echo $data['text7'];?></textarea></div>
                                            </div>
        									
                                            
                                            <?php $x=0; while ($x++<4){ ?>
                                            <hr>
                                            <div class="form-group"><label class="col-sm-2 control-label">Иконка <?php echo $x; ?></label>
                                                <div class="col-sm-10">
                                                        <select class="form-control image_select_input" multiple="" name="ico<?php echo $x; ?>">
	                                                        <?php
															$results = mysql_query("SELECT * FROM icons WHERE item='calendar' ORDER BY id", $db);
															$datas = mysql_fetch_array($results);
															do{
															?>
                                                            <option value="<?php echo $datas['img'];?>" class="image_select" <?php if($icons[$x]==$datas['img']){echo 'selected';}?> style="background:url(../upload/icons/calendar/<?php echo $datas['img'];?>) no-repeat center center;"></option>
                                                            <?php	} while($datas = mysql_fetch_array($results));  ?>                                                            
                                                        </select>
                                                </div>
                                            </div>
                                            <?php } ?>
                                            
                                            <div class="form-group"><label class="col-sm-1 control-label">Заголовок:</label>
                                                <div class="col-sm-11"><input type="text" name="title7" class="form-control" value="<?php echo $data['title7'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Заголовок:</label>
                                                <div class="col-sm-11"><input type="text" name="title8" class="form-control" value="<?php echo $data['title8'];?>"></div>
                                            </div>
                                            
                                             <?php $x=0; while ($x++<5){ ?>
                                            <div class="form-group"><label class="col-sm-1 control-label">День <?php echo $x; ?>:</label>
                                                <div class="col-sm-11"><input type="text" name="day<?php echo $x; ?>" class="form-control" value="<?php echo $data['day'.$x];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label"></label>
                                                <div class="col-sm-11"><textarea class="summernote" name="day<?php echo $x; ?>_text"><?php echo $data['day'.$x.'_text'];?></textarea></div>
                                            </div>                                          
                                      		<?php } ?>
                                            
                                            
                                            <input type="hidden" name="edit" value="<?php echo $_GET['id']; ?>">
                                            
                                            
                                        </fieldset>
                                        
                                        <input type="submit" class="btn btn-primary btn-lg" value="Сохранить">
                                        <a href="index.php?item=<?php echo $_GET['item']; ?>" class="btn btn-warning btn-lg">Обновить</a>
                                        <a href="index.php?item=<?php echo $_GET['item']; ?>" class="btn btn-default btn-lg">Отмена</a>
                                        </form>
                                                                                

                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>

        </div>
        
