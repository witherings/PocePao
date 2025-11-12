<?php
$result = mysql_query("SELECT * FROM clients ORDER BY sort DESC", $db);
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
									<form action="index.php?item=<?php echo $item?>&sub=<?php echo $_GET['sub'];?>" method="POST" enctype="multipart/form-data">
                                        <fieldset class="form-horizontal">

                                            <div class="form-group"><label class="col-sm-2 control-label">Url:</label>
                                                <div class="col-sm-10"><input type="text" name="url" class="form-control"></div>
                                            </div>
	                                        <div class="form-group"><label class="col-sm-2 control-label">Сортировка:</label>
                                                <div class="col-sm-10"><input type="text" name="sort" class="form-control" style="width:50px;" value="<?php echo $sort;?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Фото [180 x 115]:</label>
                                                <div class="col-sm-10"><input type="file" name="photo" id="photos"></div>
                                            </div>
                                            <input type="hidden" name="add" value="clients">
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
