
<div id="page-wrapper" class="gray-bg">
        <div class="row border-bottom">

        </div>
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>Клиенты</h2>
                    <ol class="breadcrumb">
                        <li>
                            <a href="index.php">Главная</a>
                        </li>
                        <li class="active">
                            <strong>Клиенты</strong>
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
                                                        Ссылка
                                                    </th>
                                                    <th>
                                                        Действия
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                
                                               <?php
												$pics = scandir("../upload/clients/");
													 foreach($pics as $value) 
													  { 
													  if($value!=='.' && $value!=='..'){
														  $n=explode('.',$value);
														  $name=$n[0];
														  ?>
                                                <tr id="<?php echo $name; ?>">
                                                    <td>
                                                        <img src="../upload/clients/<?php echo $value?>" width="74" height="61">
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control" value="upload/clients/<?php echo $value?>">
                                                    </td>
                                                    <td>
                                                        <button type="button" class="btn btn-danger" onClick="delete_item('clients','<?php echo $name;?>');"> <i class="fa fa-trash"></i> Удалить</button>
                                                    </td>
                                                </tr>
												<?php }} ?> 
                                                
                                                </tbody>
                                            </table>
                                            <div class="ibox-content">
                                            <form action="template/actions/upload.php?type=clients" id="my-awesome-dropzone" class="dropzone">
                                                <div class="dropzone-previews"></div>
                                                <a class="btn btn-primary pull-left">74 x 61 jpg</a>
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
