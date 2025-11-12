
        <div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">
                            <div class="tab-content">

															<form action="index.php?item=<?php echo $_GET['item']; ?>" method="POST" enctype="multipart/form-data">
                                <div id="tab-1" class="tab-pane active">
                                  <div class="panel-body">
                                      <fieldset class="form-horizontal">
                                        <div class="form-group"><label class="col-sm-2 control-label">Название:</label>
                                              <div class="col-sm-10"><input type="text" name="title" class="form-control"></div>
                                          </div>
                                          <div class="form-group"><label class="col-sm-2 control-label">Цена:</label>
                                              <div class="col-sm-10"><input type="text" name="price" class="form-control"></div>
                                          </div>
                                          <div class="form-group"><label class="col-sm-2 control-label">Фото [800 x 900]:</label>
                                              <div class="col-sm-10"><input type="file" name="img" id="photos"></div>
                                          </div>
                                          <label>Текст</label>
                                          <textarea class="summernote" name="text"></textarea><br><br>
                                          <input type="hidden" name="add_product" value="<?php echo $id;?>">
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
