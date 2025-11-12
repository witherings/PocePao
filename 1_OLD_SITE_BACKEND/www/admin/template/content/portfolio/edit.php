        <div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">
                            <div class="tab-content">

															<form action="index.php?item=<?php echo $_GET['item']; ?>&sub=<?php echo $_GET['sub']; ?>" method="POST" enctype="multipart/form-data">
                                <div id="tab-1" class="tab-pane active">
                                  <div class="panel-body">

                                    <?php
                                    $id=$_GET['id'];
									$result = mysql_query("SELECT * FROM portfolio WHERE id='$id'", $db);
									$data = mysql_fetch_array($result);
									?>

                                      <fieldset class="form-horizontal">
                                        <div class="form-group"><label class="col-sm-2 control-label">Заголовок:</label>
                                              <div class="col-sm-10"><input type="text" name="title" class="form-control" value="<?php echo $data['title'];?>"></div>
                                          </div>

                                          <div class="form-group">
                                            <label class="col-sm-2 control-label">Превью [352 x 238]:</label>
                                              <div class="col-sm-10">
                                                <img src="../assets/imgs/portfolio/<?php echo $data['img_prev'];?>" width="352"><br><br>
                                                <input type="file" name="img_prev" id="photos"></div>
                                          </div>
                                          <div class="form-group">
                                            <label class="col-sm-2 control-label">Большая:</label>
                                              <div class="col-sm-10">
                                                <img src="../assets/imgs/portfolio/<?php echo $data['img_big'];?>" width="352"><br><br>
                                                <input type="file" name="img_big" id="photos"></div>
                                          </div>
                                          <input type="hidden" name="edit" value="<?php echo $id; ?>">
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
