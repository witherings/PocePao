
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
                                    
									<form action="index.php?item=<?php echo $_GET['item']; ?>" method="POST">
                                        <fieldset class="form-horizontal">
                                            
                                            <div class="form-group"><label class="col-sm-1 control-label">Тип:</label>
                                                <div class="col-sm-11">
                                                <select name="type">
                                                	<option value="курс">курс</option>
                                                    <option value="дегустация">дегустация</option>
                                                    <option value="лекция">лекция</option>
                                                </select>
                                                </div>
                                            </div>    
                                                                      
                                            <div class="form-group"><label class="col-sm-1 control-label">Заголовок:</label>
                                                <div class="col-sm-11"><input type="text" name="title" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Дата:</label>
                                                <div class="col-sm-11"><input type="text" name="date" class="form-control" value="<?php echo date("Y-m-d");?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Анонс:</label>
                                                <div class="col-sm-11"><input type="text" name="anons" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Город:</label>
                                                <div class="col-sm-11"><input type="text" name="city" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Кол-во дней:</label>
                                                <div class="col-sm-11"><input type="text" name="days" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Стоимость:</label>
                                                <div class="col-sm-11"><input type="text" name="price" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Ссылка:</label>
                                                <div class="col-sm-11"><input type="text" name="link" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Заголовок:</label>
                                                <div class="col-sm-11"><input type="text" name="stitle1" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Заголовок:</label>
                                                <div class="col-sm-11"><input type="text" name="stitle2" class="form-control"></div>
                                            </div>
                                             <div class="form-group"><label class="col-sm-1 control-label">Текст:</label>
                                                <div class="col-sm-11"><textarea class="summernote" name="text1"></textarea></div>
                                            </div>
                                             <div class="form-group"><label class="col-sm-1 control-label">Текст:</label>
                                                <div class="col-sm-11"><textarea class="summernote" name="text2"></textarea></div>
                                            </div>
                                             <div class="form-group"><label class="col-sm-1 control-label">Текст:</label>
                                                <div class="col-sm-11"><textarea class="summernote" name="text3"></textarea></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Заголовок:</label>
                                                <div class="col-sm-11"><input type="text" name="stitle3" class="form-control"></div>
                                            </div>
                                             <div class="form-group"><label class="col-sm-1 control-label">Текст:</label>
                                                <div class="col-sm-11"><textarea class="summernote" name="text4"></textarea></div>
                                            </div>
                                             <div class="form-group"><label class="col-sm-1 control-label">Текст:</label>
                                                <div class="col-sm-11"><textarea class="summernote" name="text5"></textarea></div>
                                            </div>
                                             <div class="form-group"><label class="col-sm-1 control-label">Текст:</label>
                                                <div class="col-sm-11"><textarea class="summernote" name="text6"></textarea></div>
                                            </div>
                                             <div class="form-group"><label class="col-sm-1 control-label">Текст:</label>
                                                <div class="col-sm-11"><textarea class="summernote" name="text7"></textarea></div>
                                            </div>
        									
                                            
                                            <?php $x=0; while ($x++<4){ ?>
                                            <hr>
                                            <div class="form-group"><label class="col-sm-2 control-label">Иконка <?php echo $x; ?></label>
                                                <div class="col-sm-10">
                                                        <select class="form-control image_select_input" multiple="" name="ico<?php echo $x; ?>">
	                                                        <?php
															$results = mysql_query("SELECT * FROM icons WHERE item='calendar' ORDER BY id", $db);
															$datas = mysql_fetch_array($results);
															do{
															?>
                                                            <option value="<?php echo $datas['img'];?>" class="image_select" style="background:url(../upload/icons/calendar/<?php echo $datas['img'];?>) no-repeat center center;"></option>
                                                            <?php	} while($datas = mysql_fetch_array($results));  ?>                                                            
                                                        </select>
                                                </div>
                                            </div>
                                            <?php } ?>
                                            
                                            <div class="form-group"><label class="col-sm-1 control-label">Заголовок:</label>
                                                <div class="col-sm-11"><input type="text" name="title7" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label">Заголовок:</label>
                                                <div class="col-sm-11"><input type="text" name="title8" class="form-control"></div>
                                            </div>
                                            
                                             <?php $x=0; while ($x++<5){ ?>
                                            <div class="form-group"><label class="col-sm-1 control-label">День <?php echo $x; ?>:</label>
                                                <div class="col-sm-11"><input type="text" name="day<?php echo $x; ?>" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-1 control-label"></label>
                                                <div class="col-sm-11"><textarea class="summernote" name="day<?php echo $x; ?>_text"></textarea></div>
                                            </div>                                          
                                      		<?php } ?>
                                            
                                             <input type="hidden" name="add" value="ok">
                                        </fieldset>
                                        
                                        <input type="submit" class="btn btn-primary btn-lg" value="Сохранить">
                                        <a href="index.php?item=<?php echo $_GET['item']; ?>" class="btn btn-warning btn-lg">Обновить</a>
                                        <a href="index.php?item=<?php echo $_GET['item']; ?>" class="btn btn-default btn-lg">Отмена</a>
                                        </form>
                                                                                

                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>

        </div>