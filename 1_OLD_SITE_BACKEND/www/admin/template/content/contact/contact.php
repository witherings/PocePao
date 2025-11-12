<?php 
//---------------------------------------------------------------------------------------------------------------------

if(isset($_POST['edit'])){
	$edit=$_POST['edit'];
	foreach($_POST as $key => $value)
  	{
	//echo "$key - $value<br>";
	  if($key!='add' && $key!='files' && $key!='edit')
	  mysql_query("UPDATE content_$lang SET $key='$value' WHERE id='$edit'", $db);
  	}
	echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";	
} 

//---------------------------------------------------------------------------------------------------------------------
?>
        <div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">
                            <ul class="nav nav-tabs">
                                <li class="active"><a data-toggle="tab" href="#tab-1">Данные</a></li>
                            </ul>
                            <div class="tab-content">
                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                    <?php
									$result = mysql_query("SELECT * FROM content_$lang WHERE action='$item'", $db);
									$data = mysql_fetch_array($result);
									?>
									<form action="index.php?item=<?php echo $item; ?>&sub=<?php echo $_GET['sub'];?>" method="POST">
                                        <fieldset class="form-horizontal">
	                                        <div class="form-group"><label class="col-sm-2 control-label">Название:</label>
                                                <div class="col-sm-10"><input type="text" name="name" class="form-control" value="<?php echo $data['name'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Url:</label>
                                                <div class="col-sm-10"><input type="text" name="action" class="form-control" value="<?php echo $data['action'];?>" disabled></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Статус:</label>
                                                <div class="col-sm-10">
                                                	<select name="status" class="form-control" style="width:120px;">
                                                    	<option value="1" <?php if($data['status']=='1'){ echo "selected";}?>>активно</option>
                                                        <option value="0" <?php if($data['status']=='0'){ echo "selected";}?>>скрыто</option>
                                                    </select>
                                                </div>
                                            </div>
	                                        <div class="form-group"><label class="col-sm-2 control-label">Сортировка:</label>
                                                <div class="col-sm-10"><input type="text" name="sort" class="form-control" style="width:50px;"  value="<?php echo $data['sort'];?>"></div>
                                            </div>

											<label>Текст</label>
                                            <textarea class="summernote" name="content"><?php echo $data['content'];?></textarea>			<br><br>
                                            
                                            <div class="form-group"><label class="col-sm-2 control-label">H1:</label>
                                                <div class="col-sm-10"><input type="text" name="h1" class="form-control" value="<?php echo $data['h1'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Title:</label>
                                                <div class="col-sm-10"><input type="text" name="title" class="form-control" value="<?php echo $data['title'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Keywords:</label>
                                                <div class="col-sm-10"><input type="text" name="keywords" class="form-control" value="<?php echo $data['keywords'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Description:</label>
                                                <div class="col-sm-10"><input type="text" name="description" class="form-control" value="<?php echo $data['description'];?>"></div>
                                            </div>
                                            
                                            <input type="hidden" name="edit" value="<?php echo $data['id']; ?>">
                                        </fieldset>
                                        <br>
                                        <input type="submit" class="btn btn-primary btn-lg" value="Сохранить">
                                        <a href="index.php?item=<?php echo $item; ?>&sub=<?php echo $_GET['sub'];?>" class="btn btn-default btn-lg">Отмена</a>
                                     </form>

                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>

        </div>




