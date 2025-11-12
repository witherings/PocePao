
<div id="page-wrapper" class="gray-bg">
        <div class="row border-bottom">

        </div>
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>Выступления</h2>
                    <ol class="breadcrumb">
                        <li>
                            <a href="index.php">Главная</a>
                        </li>
                        <li>
                            Выступления
                        </li>
                        <li class="active">
                            <strong>Карта выступлений</strong>
                        </li>
                    </ol>
                </div>
            </div>
            
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
                                                        Действия
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                
                                               <?php
												$result = mysql_query("SELECT * FROM maps_pics ORDER BY id", $db);
												$data = mysql_fetch_array($result);
													if($data)do{ 
												?>	 
                                                <tr id="<?php echo $data['id']?>">
                                                    <td>
                                                        <img src="../upload/events/maps/<?php echo $data['img'];?>"  height="100">
                                                    </td>
                                                    <td>
                                                        <button type="button" class="btn btn-danger" onClick="delete_item('maps_pics',<?php echo $data['id']?>);"> <i class="fa fa-trash"></i> Удалить</button>
                                                    </td>
                                                </tr>
                                                <?php	} while($data = mysql_fetch_array($result));  ?>
                                                
                                                </tbody>
                                            </table>


                                            <div class="ibox-content" style="border:none; padding:10px 0px;">
                                            <form action="template/actions/upload.php?type=maps_pics" id="my-awesome-dropzone" class="dropzone">
                                                <div class="dropzone-previews"></div>
                                                <a class="btn btn-primary pull-left">1030 x 424 PNG</a>
                                            </form>
                                            </div>
                                            <a href="index.php?item=<?php echo $item; ?>" class="btn btn-warning btn-lg">Обновить</a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>

        </div>
        
<?php include "template/files/footer.php"; ?>
</div>
