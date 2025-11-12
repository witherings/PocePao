
<div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">
                            <ul class="nav nav-tabs">
                                <li class="active"><a data-toggle="tab" href="#tab-1">Фото</a></li>
                            </ul>
                            <div class="tab-content">
                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">

                                        <div class="table-responsive">
                                            <table class="table table-bordered table-stripped">
                                                <thead>
                                                <tr>
                                                    <th>
                                                        Изображение
                                                    </th>
                                                    <th>
                                                        Ссылка
                                                    </th>
                                                    <th>
                                                        Действия
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                
                                               <?php
												$result = mysql_query("SELECT * FROM profile_pics WHERE profile_id='$id' ORDER BY id", $db);
												$data = mysql_fetch_array($result);
													if($data)do{ 
												?>	 
                                                <tr id="<?php echo $data['id']?>">
                                                    <td>
                                                        <img src="../upload/profile/<?php echo $data['img'];?>" height="35">
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control" value="upload/profile/<?php echo $data['img'];?>">
                                                    </td>
                                                    <td>
                                                        <button type="button" class="btn btn-danger" onClick="delete_item('profile_pics',<?php echo $data['id']?>);"> <i class="fa fa-trash"></i> Удалить</button>
                                                    </td>
                                                </tr>
                                                <?php	} while($data = mysql_fetch_array($result));  ?>
                                                
                                                </tbody>
                                            </table>
                                            <div class="ibox-content">
                                            <form action="template/actions/upload.php?type=profile_pics&id=<?php echo $id;?>" id="my-awesome-dropzone" class="dropzone">
                                                <div class="dropzone-previews"></div>
                                                <a class="btn btn-primary pull-left">1000 x ... JPG</a>
                                            </form>
                                            </div>
                                            <a href="index.php?item=<?php echo $item; ?>&action=<?php echo $action; ?>&id=<?php echo $id; ?>" class="btn btn-warning btn-lg">Обновить</a>
                                            <a href="index.php?item=<?php echo $item; ?>" class="btn btn-default btn-lg">Отмена</a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>

        </div>
        

