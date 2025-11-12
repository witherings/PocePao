<?php
if($page=='home'){$size='2000 x 1100';}else{$size='2000 x 467';}
?>
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
                                   <img src="../upload/others/<?php echo $page; ?>_bg.jpg" height="200">
                                    
								 <div class="ibox-content" style="border:none; padding:15px 0px;">
                                            <form action="template/actions/upload.php?type=background&page=<?php echo $page; ?>" id="my-awesome-dropzone" class="dropzone">
                                                <div class="dropzone-previews"></div>
                                                <a class="btn btn-primary pull-left"><?php echo $size; ?> JPG</a>
                                            </form>
                                         </div>
                                   		
                                        

                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>

        </div>

