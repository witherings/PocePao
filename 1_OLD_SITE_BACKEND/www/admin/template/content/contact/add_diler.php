<?php
$sort=0;
$region=$_GET['id'];
$obl=$_GET['obl'];
$result = mysql_query("SELECT * FROM dictionary_contact_$lang WHERE region='$region' ORDER BY sort DESC", $db);
$data = mysql_fetch_array($result);
if($data){$sort=$data['sort']+1;}
?>

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
									<form action="index.php?item=<?php echo $item; ?>&sub=<?php echo $_GET['sub'];?>" method="POST">
                                        <fieldset class="form-horizontal">
	                                        <div class="form-group"><label class="col-sm-2 control-label">Город:</label>
                                                <div class="col-sm-10"><input type="text" name="city" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Название:</label>
                                                <div class="col-sm-10"><input type="text" name="name" class="form-control"></div>
                                            </div>
                                           <div class="form-group"><label class="col-sm-2 control-label">Телефон:</label>
                                                <div class="col-sm-10"><input type="text" name="phone" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Адрес:</label>
                                                <div class="col-sm-10"><input type="text" name="address" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Сайт:</label>
                                                <div class="col-sm-10"><input type="text" name="site" class="form-control"></div>
                                            </div>
	                                        <div class="form-group"><label class="col-sm-2 control-label">Сортировка:</label>
                                                <div class="col-sm-10"><input type="text" name="sort" class="form-control" style="width:50px;" value="<?php echo $sort;?>"></div>
                                            </div>
                                            <input type="hidden" name="region" value="<?php echo $region;?>">
                                            <input type="hidden" name="status" value="1">
                                            <input type="hidden" name="add" value="dictionary_contacts">
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
