        <div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">
                            <div class="tab-content">

															<form action="index.php?item=<?php echo $_GET['item']; ?>&sub=<?php echo $_GET['sub']; ?>" method="POST" enctype="multipart/form-data">
                                <div id="tab-1" class="tab-pane active">
                                  <div class="panel-body">
                                      <fieldset class="form-horizontal">
                                        <div class="form-group"><label class="col-sm-2 control-label">Заголовок:</label>
                                              <div class="col-sm-10"><input type="text" name="title" class="form-control" ></div>
                                          </div>
                                          <div class="form-group">
                                            <label class="col-sm-2 control-label">Превью [352 x 238]:</label>
                                            <div class="col-sm-10"><input type="file" name="img_prev" id="photos"></div>
                                          </div>
                                          <?php if($_GET['sub']=='14' || $_GET['sub']=='16'){?>
                                            <div class="form-group"><label class="col-sm-2 control-label">Youtube код (https://www.youtube.com/watch?v=<font style="color:red">SLN-XfLSSuc</font>) только то, что красным!:</label>
                                                  <div class="col-sm-10"><input type="text" name="link" class="form-control" placeholder='SLN-XfLSSuc'></div>
                                              </div>
                                          <?php }else{ ?>
                                          <div class="form-group">
                                            <label class="col-sm-2 control-label">Большая:</label>
                                            <div class="col-sm-10"><input type="file" name="img_big" id="photos"></div>
                                          </div>
                                          <?php } ?>
                                          <div class="form-group">
                                            <label class="col-sm-2 control-label">На главной:</label>
                                            <div class="col-sm-10"><input type="checkbox" name="home"></div>
                                          </div>
                                          <input type="hidden" name="add" value="portfolio">
                                      </fieldset>
                                  </div>
                                </div>
																<br>
																<input type="submit" class="btn btn-primary btn-lg" value="Сохранить">
																<a href="index.php?item=<?php echo $item; ?>" class="btn btn-default btn-lg">Отмена</a>
														 </form>
                            </div>
                    </div>
                </div>
            </div>

        </div>
