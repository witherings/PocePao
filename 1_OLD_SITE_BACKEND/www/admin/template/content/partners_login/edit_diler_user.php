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
                                    <?php
									$result = mysql_query("SELECT * FROM diler_users WHERE id='$id'", $db);
									$data = mysql_fetch_array($result);
									?>
									<form action="index.php?item=<?php echo $item; ?>&sub=<?php echo $_GET['sub'];?>" method="POST">
                                        <fieldset class="form-horizontal">
	                                        <div class="form-group"><label class="col-sm-2 control-label">Логин:</label>
                                                <div class="col-sm-10"><input type="text" name="login" class="form-control" value="<?php echo $data['login'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Пароль:</label>
                                                <div class="col-sm-10"><input type="text" name="password" class="form-control" value="<?php echo $data['password'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Почта:</label>
                                                <div class="col-sm-10"><input type="text" name="mail" class="form-control" value="<?php echo $data['mail'];?>"></div>
                                            </div>
                                            
                                            <input type="hidden" name="edit_diler_user" value="<?php echo $id; ?>">
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




