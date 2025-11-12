<?php
$id=$_GET['type'];
$result = mysql_query("SELECT * FROM users_file_$lang WHERE type='$id' ORDER BY sort DESC", $db);
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
                                    <input type="hidden" name="diler" value="0">
                                    <input type="hidden" name="diler2" value="0">
                                        <fieldset class="form-horizontal">
	                                        <div class="form-group"><label class="col-sm-2 control-label">Название:</label>
                                                <div class="col-sm-10"><input type="text" name="name" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Файл:</label>
                                                <div class="col-sm-10"><input type="file" name="photo" id="photos"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Url:</label>
                                                <div class="col-sm-10"><input type="text" name="url" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Статус:</label>
                                                <div class="col-sm-10">
                                                	<select name="status" class="form-control" style="width:120px;">
                                                    	<option value="1" selected>активно</option>
                                                        <option value="0">скрыто</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Тип:</label>
                                                <div class="col-sm-10">
                                                	<select name="download_main" class="form-control" style="width:120px;">
                                                    	<option value="0" selected>ссылка</option>
                                                        <option value="1">кнопка скачать</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Херсон:</label>
                                                <div class="col-sm-10"><input type="checkbox" name="diler" class="form-control" style="width:auto !important;" value="1"></div>
                                            </div>
                                             <div class="form-group"><label class="col-sm-2 control-label">Белая Церковь:</label>
                                                <div class="col-sm-10"><input type="checkbox" name="diler2" class="form-control" style="width:auto !important;" value="1"></div>
                                            </div>
	                                        <div class="form-group"><label class="col-sm-2 control-label">Сортировка:</label>
                                                <div class="col-sm-10"><input type="text" name="sort" class="form-control" style="width:50px;"  value="<?php echo $sort;?>"></div>
                                            </div>
                                           	<input type="hidden" name="type" value="<?php echo $id;?>"> 
                                            <input type="hidden" name="add_diler_file" value="ok">
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




