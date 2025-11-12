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
									$result = mysql_query("SELECT * FROM contacts WHERE id='$id'", $db);
									$data = mysql_fetch_array($result);
									?>
                                    
									<form action="index.php?item=<?php echo $item; ?>" method="POST">
                               <fieldset class="form-horizontal">
                                           
                                        
                                         <div class="form-group"><label class="col-sm-2 control-label">Телефон / Email:</label>
                                                <div class="col-sm-10"><input type="text" name="title" class="form-control" value="<?php echo $data['title'];?>"></div>
                                            </div>
                                            
                                            <div class="form-group"><label class="col-sm-2 control-label">Тип:</label>
                                                <div class="col-sm-10">
                                                        <select class="form-control" multiple="" name="type">
	                                                        <option value="ks" <?php if($data['type']=='ks'){echo 'selected';}?>>Киевстар</option>
                                                            <option value="vd" <?php if($data['type']=='vd'){echo 'selected';}?>>Vodafone (МТС)</option>
                                                            <option value="lf" <?php if($data['type']=='lf'){echo 'selected';}?>>Life Cell</option>
                                                            <option value="mail" <?php if($data['type']=='mail'){echo 'selected';}?>>Email</option>
                                                        </select>
                                                </div>
                                            </div>
                                            
                                            <div class="form-group"><label class="col-sm-2 control-label">Очередность:</label>
                                                <div class="col-sm-10"><input type="text" name="ord" class="form-control" value="<?php echo $data['ord'];?>"></div>
                                            </div>
                                        </fieldset>
                                   		<br>     
                                         <input type="hidden" name="edit" value="<?php echo $id; ?>">
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
