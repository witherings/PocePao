        <div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">
                            <ul class="nav nav-tabs">
                                <li class="active"><a data-toggle="tab" href="#tab-1">Регион - <?php echo $obl;?></a></li>
                            </ul>
                            <div class="tab-content">
                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                    <?php
									$id=$_GET['id'];
									$result = mysql_query("SELECT * FROM dictionary_contacts_$lang WHERE id='$id'", $db);
									$data = mysql_fetch_array($result);
									?>
									<form action="index.php?item=<?php echo $item; ?>&sub=<?php echo $_GET['sub'];?>" method="POST">
                                        <fieldset class="form-horizontal">
	                                        <div class="form-group"><label class="col-sm-2 control-label">Город:</label>
                                                <div class="col-sm-10"><input type="text" name="city" class="form-control" value="<?php echo $data['city'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Название:</label>
                                                <div class="col-sm-10"><input type="text" name="name" class="form-control" value="<?php echo $data['name'];?>"></div>
                                            </div>
                                           <div class="form-group"><label class="col-sm-2 control-label">Телефон:</label>
                                                <div class="col-sm-10"><input type="text" name="phone" class="form-control" value="<?php echo $data['phone'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Адрес:</label>
                                                <div class="col-sm-10"><input type="text" name="address" class="form-control" value="<?php echo $data['address'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Сайт:</label>
                                                <div class="col-sm-10"><input type="text" name="site" class="form-control" value="<?php echo $data['site'];?>"></div>
                                            </div>
	                                        <div class="form-group"><label class="col-sm-2 control-label">Сортировка:</label>
                                                <div class="col-sm-10"><input type="text" name="sort" class="form-control" style="width:50px;" value="<?php echo $data['sort'];?>"></div>
                                            </div>
                                            <input type="hidden" name="edit" value="<?php echo $id; ?>">
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
