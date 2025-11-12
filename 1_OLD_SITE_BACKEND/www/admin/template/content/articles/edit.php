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
									$result = mysql_query("SELECT * FROM slider WHERE id='$id'", $db);
									$data = mysql_fetch_array($result);
									?>
									<form action="index.php?item=<?php echo $item; ?>" method="POST" enctype="multipart/form-data">
                                        <fieldset class="form-horizontal">

                                            <div class="form-group"><label class="col-sm-2 control-label">Текст:</label>
                                                  <div class="col-sm-10"><input type="text" name="text" class="form-control" value="<?php echo $data['text'];?>"></div>
                                              </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Текущее фото:</label>
                                                <div class="col-sm-10"><img src="../assets/images/slider/<?php echo $data['img'];?>" width="100"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Фото [1920 x 800]:</label>
                                                <div class="col-sm-10"><input type="file" name="img" id="photos"></div>
                                            </div>


                                            <input type="hidden" name="edit" value="<?php echo $id; ?>">
                                        </fieldset>
                                        <br>
                                        <input type="submit" class="btn btn-primary btn-lg" value="Сохранить">
                                        <a href="index.php?item=<?php echo $item; ?>" class="btn btn-default btn-lg">Отмена</a>
                                     </form>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>

        </div>
