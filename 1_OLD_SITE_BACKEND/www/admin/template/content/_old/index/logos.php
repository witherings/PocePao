
<div id="page-wrapper" class="gray-bg">
        <div class="row border-bottom">

        </div>
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>Главная</h2>
                    <ol class="breadcrumb">
                        <li>
                            <a href="index.php">Главная</a>
                        </li>
                        <li class="active">
                            <strong>Логотипы партнеров</strong>
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
<?php 
 foreach($_POST as $key => $value) 
  { 
     $id=substr($key, 3);
	 $cell=substr($key, 0,3);
	 echo "id: $id | Cell: $cell | Value: $value <br />"; 
	 if(mysql_query("UPDATE index_logos SET $cell='$value' WHERE id='$id'", $db)){echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";}
  } 
?>
                                        <div class="table-responsive">
                                            <table class="table table-bordered table-stripped">
                                                <thead>
                                                <tr>
                                                    <th>
                                                        Изображение
                                                    </th>
                                                    <th>
                                                        Очередность
                                                    </th>

                                                    <th>
                                                        Ссылка
                                                    </th>
                                                    <th>
                                                        Alt
                                                    </th>
                                                    <th>
                                                        Действия
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                
                                               <?php
												$result = mysql_query("SELECT * FROM index_logos ORDER BY id", $db);
												$data = mysql_fetch_array($result);
													if($data)do{ 
												?>	 
                                                <tr id="<?php echo $data['id']?>">
                                                    <td style="background:#4E4E4E;">
                                                        <img src="../upload/index/<?php echo $data['img'];?>">
                                                    </td>

                                                    <td>
                                                    <form action="" method="post">
                                                        <input type="text" class="form-control" name="ord<?php echo $data['id'];?>" value="<?php echo $data['ord'];?>">
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control" name="url<?php echo $data['id'];?>" value="<?php echo $data['url'];?>">
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control" name="alt<?php echo $data['id'];?>" value="<?php echo $data['alt'];?>">
                                                    </td>
                                                    <td>
                                                        <button type="button" class="btn btn-danger" onClick="delete_item('index_logos',<?php echo $data['id']?>);"> <i class="fa fa-trash"></i> Удалить</button>
                                                        <button type="submit" class="btn btn-success"> <i class="fa fa-save"></i> Сохранить</button>
                                                        </form>
                                                    </td>
                                                </tr>
                                                <?php	} while($data = mysql_fetch_array($result));  ?>
                                                
                                                </tbody>
                                            </table>
                                            <div class="ibox-content">
                                            <form action="template/actions/upload.php?type=index_logos" id="my-awesome-dropzone" class="dropzone">
                                                <div class="dropzone-previews"></div>
                                                <a class="btn btn-primary pull-left">200 x 120 PNG</a>
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
