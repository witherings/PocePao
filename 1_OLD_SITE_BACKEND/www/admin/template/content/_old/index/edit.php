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
									$result = mysql_query("SELECT * FROM profile WHERE id='$id'", $db);
									$data = mysql_fetch_array($result);
									?>
									<form action="index.php?item=<?php echo $item; ?>" method="POST">
                                        <fieldset class="form-horizontal">
                                            <div class="form-group"><label class="col-sm-2 control-label">Заголовок:</label>
                                                <div class="col-sm-10"><input type="text" name="title" class="form-control" value="<?php echo $data['title'];?>"></div>
                                            </div>
                                            <textarea class="summernote" name="text"><?php echo $data['text'];?></textarea>
                                            <input type="hidden" name="edit" value="<?php echo $id; ?>">
                                            
                                            <br>   
                                        <img src="../upload/profile/<?php echo $data['img']; ?>" height="100">
                                        <br><br>  
                                        </fieldset>
                                        
                                        <input type="submit" class="btn btn-primary btn-lg" value="Сохранить">
                                        <a href="index.php?item=<?php echo $item; ?>&action=<?php echo $action; ?>&id=<?php echo $id; ?>" class="btn btn-warning btn-lg">Обновить</a>
                                        <a href="index.php?item=<?php echo $item; ?>" class="btn btn-default btn-lg">Отмена</a>
                                        </form>
                                        
                                         <div class="ibox-content" style="border:none; padding:15px 0px;">
                                            <form action="template/actions/upload.php?type=profile&id=<?php echo $id;?>" id="my-awesome-dropzone" class="dropzone">
                                                <div class="dropzone-previews"></div>
                                                <a class="btn btn-primary pull-left">1000 x ... JPG</a>
                                            </form>
                                         </div>
                                   		
                                        

                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>

        </div>
