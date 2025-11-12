<?php
if(isset($_POST['edit'])){
	$text_top=$_POST['text_top'];
	$title1=$_POST['title_1'];	
	$text1=$_POST['text_1'];
	$title2=$_POST['title_2'];	
	$text2=$_POST['text_2'];

	if(mysql_query("UPDATE about_$lang SET text_top='$text_top', title_1='$title1', text_1='$text1', title_2='$title2', text_2='$text2' WHERE id='1'", $db)){
		echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";
	}
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
									$result = mysql_query("SELECT * FROM about_$lang", $db);
									$data = mysql_fetch_array($result);
									?>
									<form action="index.php?item=<?php echo $item; ?>" method="POST">
                                        <fieldset class="form-horizontal">
                                            
                                            <textarea class="summernote" name="text_top"><?php echo $data['text_top'];?></textarea>
                                            <br>
                                            
                                            <div class="form-group"><label class="col-sm-2 control-label">Заголовок:</label>
                                                <div class="col-sm-10"><input type="text" name="title_1" class="form-control" value="<?php echo $data['title_1'];?>"></div>
                                            </div>
                                            <textarea class="summernote" name="text_1"><?php echo $data['text_1'];?></textarea>
                                            <br>
                                            
                                            <div class="form-group"><label class="col-sm-2 control-label">Заголовок:</label>
                                                <div class="col-sm-10"><input type="text" name="title_2" class="form-control" value="<?php echo $data['title_2'];?>"></div>
                                            </div>
                                            <textarea class="summernote" name="text_2"><?php echo $data['text_2'];?></textarea>
                                            
                                            
                                            <input type="hidden" name="edit" value="<?php echo $id; ?>">
                                            
                                            <br>   
                                         <?php
                                         $img1="upload/about/".$data['img_top'];
										 $img2="upload/about/".$data['img_1'];
										 $img3="upload/about/".$data['img_2'];
										 ?>   
                                         <a name="pic">
                                        <a href="index.php?item=others_cropper&type=about_1&img=<?php echo $img1;?>"><img src="../<?php echo $img1; ?>" height="100"></a>
                                        <a href="index.php?item=others_cropper&type=about_2&img=<?php echo $img2;?>"><img src="../<?php echo $img2; ?>" height="100"></a>
                                        <a href="index.php?item=others_cropper&type=about_3&img=<?php echo $img3;?>"><img src="../<?php echo $img3; ?>" height="100"></a>
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
        
