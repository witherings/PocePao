<?php
$result = mysql_query("SELECT * FROM slider_$lang ORDER BY sort DESC", $db);
$data = mysql_fetch_array($result);
$sort=$data['sort']+1;
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
									<form action="index.php?item=<?php echo $item; ?>&sub=<?php echo $_GET['sub'];?>" method="POST" enctype="multipart/form-data">
                                        <fieldset class="form-horizontal">
	                                        <div class="form-group"><label class="col-sm-2 control-label">Текст большой:</label>
                                                <div class="col-sm-10"><input type="text" name="text_big" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Текст маленький:</label>
                                                <div class="col-sm-10"><input type="text" name="text_small" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Url:</label>
                                                <div class="col-sm-10"><input type="text" name="url" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Статус:</label>
                                                <div class="col-sm-10">
                                                	<select name="status" class="form-control" style="width:120px;">
                                                    	<option value="1">активно</option>
                                                        <option value="0">скрыто</option>
                                                    </select>
                                                </div>
                                            </div>
	                                        <div class="form-group"><label class="col-sm-2 control-label">Сортировка:</label>
                                                <div class="col-sm-10"><input type="text" name="sort" class="form-control" style="width:50px;" value="<?php echo $sort;?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Фото [1920 x 900]:</label>
                                                <div class="col-sm-11"><input type="file" name="photo" id="photos"></div>
                                            </div>
                                            <input type="hidden" name="add" value="slider">
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
