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
									<form action="index.php?item=<?php echo $item; ?>" method="POST">
                                        <fieldset class="form-horizontal">
                                            <div class="form-group"><label class="col-sm-2 control-label">Дата:</label>
                                                <div class="col-sm-10"><input type="text" name="date" class="form-control" value="<?php echo date("Y-m-d");?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Город:</label>
                                                <div class="col-sm-10"><input type="text" name="city" class="form-control" value="г.Киев"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Заголовок:</label>
                                                <div class="col-sm-10"><input type="text" name="title" class="form-control" placeholder="..."></div>
                                            </div>
                                            <label>Текст</label>
                                            <textarea class="summernote" name="long_text"></textarea>
                                            
                                            <input type="hidden" name="add" value="ok">
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
