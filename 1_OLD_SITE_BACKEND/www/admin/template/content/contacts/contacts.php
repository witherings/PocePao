<?php
if($lang=='ru'){$id=29;}
if($lang=='ua'){$id=34;}
if($lang=='en'){$id=35;}

if(isset($_POST['edit'])){
	$mail=$_POST['mail'];
	$text=$_POST['text'];
	mysql_query("UPDATE static SET text='$mail' WHERE id='26'", $db);
	mysql_query("UPDATE static SET text='$text' WHERE id='$id'", $db);
	echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";
	
} 

?>
        <div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">

                            <div class="tab-content">
                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                    <?php
									$result = mysql_query("SELECT * FROM static WHERE id='26'", $db);
									$data = mysql_fetch_array($result);
									$mail=$data['text'];
									$result = mysql_query("SELECT * FROM static WHERE id='$id'", $db);
									$data = mysql_fetch_array($result);
									$text=$data['text'];
									?>
									<form action="index.php?item=<?php echo $item; ?>" method="POST">
                                        <fieldset class="form-horizontal">
                                            
                                            
                                            <div class="form-group"><label class="col-sm-2 control-label">Заголовок:</label>
                                                <div class="col-sm-10"><input type="text" name="mail" class="form-control" value="<?php echo $mail;?>"></div>
                                            </div>
                                            <textarea class="summernote" name="text"><?php echo $text;?></textarea>
                                            <br>
                                            
                                           
                                            <input type="hidden" name="edit" value="1">
                                            
                                            <br>   
                                            <?php $img='upload/contacts/1.jpg'; ?>
                                        <a href="index.php?item=others_cropper&type=contacts&img=<?php echo $img;?>"><img src="../upload/contacts/1.jpg" height="100">
                                        <br><br>  
                                        </fieldset>
                                        
                                        <input type="submit" class="btn btn-primary btn-lg" value="Сохранить">
                                        <a href="index.php?item=<?php echo $item; ?>" class="btn btn-warning btn-lg">Обновить</a>
                                        <a href="index.php?item=<?php echo $item; ?>" class="btn btn-default btn-lg">Отмена</a>
                                        </form>
                                        
                                       
                                   		
                                        

                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>

        </div>
        
