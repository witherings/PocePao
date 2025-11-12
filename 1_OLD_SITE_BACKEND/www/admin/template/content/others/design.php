  
<div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">
                            <div class="tab-content">
                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">

                                        <div class="table-responsive">
                                            <table class="table table-bordered table-stripped">
                                                <thead>
                                                <tr>
                                                <th>
                                                        Категория
                                                    </th>
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
												$pics = scandir("../upload/design/");
													 foreach($pics as $value) 
													  { 
													  if($value!=='.' && $value!=='..'){
														  $n=explode('.',$value);
														  $name=$n[0];
														  ?>
                                                <tr id="<?php echo $name; ?>">
                                                	<td><?php echo $name;?></td>
                                                    <td><img src="../upload/design/<?php echo $value?>" width="74"></td>
                                                    <td style="width:100%;">
                                                                <a href="index.php?item=others_cropper&type=design&name=<?php echo $name;?>" class="btn btn-success btn-lg">Изменить</a>
                                                        
                                                    </td>
                                                </tr>
												<?php }} ?> 
                                                
                                                </tbody>
                                            </table>
                                           
                                           
                                        </div>

                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>

        </div>

