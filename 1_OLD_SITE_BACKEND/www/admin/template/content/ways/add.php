<?php
$url=$_SERVER['REQUEST_URI'];
$url=str_replace("&lang=ua", "", $url);
$url=str_replace("&lang=en", "", $url);
?>
        <div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">
                            <ul class="nav nav-tabs">
																<li class="<?php if($lang=='ua'){echo 'active';}?>"><a href="<?php echo $url; ?>&lang=ua">UA</a></li>
                                <li class="<?php if($lang=='en'){echo 'active';}?>"><a href="<?php echo $url; ?>&lang=en">EN</a></li>
                            </ul>
                            <div class="tab-content">

															<form action="index.php?item=<?php echo $_GET['item']; ?>&lang=<?php echo $lang;?>" method="POST" enctype="multipart/form-data">
                                <div id="tab-1" class="tab-pane active">
                                  <div class="panel-body">
                <form action="index.php?item=<?php echo $item; ?>" method="POST" enctype="multipart/form-data">
                                      <fieldset class="form-horizontal">
                                        <div class="form-group"><label class="col-sm-2 control-label">Название:</label>
                                              <div class="col-sm-10"><input type="text" name="title" class="form-control"></div>
                                          </div>
                                          <label>Текст</label>
                                          <textarea class="summernote" name="text"></textarea><br><br>
                                          <input type="hidden" name="add" value="news">
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
