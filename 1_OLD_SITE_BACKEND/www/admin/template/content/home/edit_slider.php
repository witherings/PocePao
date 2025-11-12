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
									$result = mysql_query("SELECT * FROM slider_$lang WHERE id='$id'", $db);
									$data = mysql_fetch_array($result);
									?>
									<form action="index.php?item=<?php echo $item; ?>&sub=<?php echo $_GET['sub'];?>" method="POST" enctype="multipart/form-data">
                                        <fieldset class="form-horizontal">
	                                        <div class="form-group"><label class="col-sm-2 control-label">Текст большой:</label>
                                                <div class="col-sm-10"><input type="text" name="text_big" class="form-control" value="<?php echo $data['text_big'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Текст маленький:</label>
                                                <div class="col-sm-10"><input type="text" name="text_small" class="form-control" value="<?php echo $data['text_small'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Url:</label>
                                                <div class="col-sm-10"><input type="text" name="url" class="form-control" value="<?php echo $data['url'];?>"></div>
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
                                            
                                            <div class="form-group"><label class="col-sm-1 control-label">Текущее фото:</label>
                                                <div class="col-sm-11"><img src="../images/_slider/<?php echo $data['img'];?>" width="300"></div>
                                            </div>

                                            <div class="form-group"><label class="col-sm-1 control-label">Фото [1920 x 900]:</label>
                                                <div class="col-sm-11"><input type="file" name="photo" id="photos"></div>
                                            </div>
                                            <input type="hidden" name="edit" value="<?php echo $id; ?>">
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
