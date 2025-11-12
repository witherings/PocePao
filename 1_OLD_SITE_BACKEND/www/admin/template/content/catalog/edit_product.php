        <div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">
                            <div class="tab-content">

															<form action="index.php?item=<?php echo $item; ?>" method="POST" enctype="multipart/form-data">
                                <div id="tab-1" class="tab-pane active">
                                  <div class="panel-body">

                                    <?php
									$result = mysql_query("SELECT * FROM products WHERE id='$id'", $db);
									$data = mysql_fetch_array($result);
									?>


                                      <fieldset class="form-horizontal">
                                        <div class="form-group"><label class="col-sm-2 control-label">Название:</label>
                                              <div class="col-sm-10"><input type="text" name="title" class="form-control" value="<?php echo $data['title'];?>"></div>
                                          </div>
                                          <div class="form-group"><label class="col-sm-2 control-label">Анонс:</label>
                                              <div class="col-sm-10"><input type="text" name="price" class="form-control" value="<?php echo $data['price'];?>"></div>
                                          </div>
                                          <?php if($lang=='ua'){?>
                                          <div class="form-group">
                                            <label class="col-sm-2 control-label">Фото [800 x 900]:</label>
                                              <div class="col-sm-10">
                                                <img src="../assets/images/shop/<?php echo $data['img'];?>" width="270" height="330"><br><br>
                                                <input type="file" name="img" id="photos"></div>
                                          </div>
                                        <?php } ?>
                                          <label>Текст</label>
                                          <textarea class="summernote" name="text"><?php echo $data['text'];?></textarea><br><br>
                                          <input type="hidden" name="edit_product" value="<?php echo $id; ?>">
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
