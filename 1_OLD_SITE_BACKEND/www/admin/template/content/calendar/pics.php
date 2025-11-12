
<div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">
                            <ul class="nav nav-tabs">
                                <li class="active"><a data-toggle="tab" href="#tab-1">Фото</a></li>
                            </ul>
                            <div class="tab-content">
                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">

                                        <div class="table-responsive">
                                                
                                               <?php
												$result = mysql_query("SELECT * FROM events WHERE id='$id'", $db);
												$data = mysql_fetch_array($result);
												?>	 
                                                <img src="../upload/calendar/<?php echo $data['img'];?>" height="100">
												<br><br>
                                            
                                            <div class="ibox-content">
                                             <form action="template/actions/upload.php?type=calendar&img=new&id=<?php echo $id;?>" id="my-awesome-dropzone" class="dropzone">
                                                <div class="dropzone-previews"></div>
                                                <a class="btn btn-primary pull-left">688 x 371 JPG</a>
                                            </form>

                                            </div>
                                            
                                            <a href="index.php?item=<?php echo $item; ?>&action=<?php echo $action; ?>&id=<?php echo $id; ?>" class="btn btn-warning btn-lg">Обновить</a>
                                            <a href="index.php?item=<?php echo $item; ?>" class="btn btn-default btn-lg">Отмена</a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
