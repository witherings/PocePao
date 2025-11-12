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
                                            <div class="form-group"><label class="col-sm-2 control-label">Заголовок:</label>
                                                <div class="col-sm-10"><input type="text" name="title" class="form-control" ></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Код видео:</label>
                                                <div class="col-sm-10"><input type="text" name="code" class="form-control"></div>
                                            </div>
                                            <textarea class="summernote" name="text">                                                
                                            </textarea>
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
