<?php 
$id=9;
if(isset($_POST['edit'])){
 foreach($_POST as $key => $value) 
  { 
	  if($key!='edit'){
			//echo "$key = $value <br />"; 
			$items=explode("_", $key);
			$i[]=$items[0];
	  }
  }
  
  $i=array_unique($i);
  	 foreach($i as $key => $value) 
  { 
		$m_t=$_POST[$value.'_t'];
		$m_d=$_POST[$value.'_d'];
		$m_k=$_POST[$value.'_k'];
		//echo "$value | $m_t | $m_d | $m_k <br />"; 
		mysql_query("UPDATE admin_menu_$lang SET meta_t='$m_t', meta_d='$m_d', meta_k='$m_k' WHERE id='$value'", $db);
  } 

	echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";
	
} 

?>
              <div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">
                            <div class="tab-content">
                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                   
                                    
									<form action="index.php?item=<?php echo $_GET['item']; ?>" method="POST">
                                        <fieldset class="form-horizontal">
                                             <?php
															$result = mysql_query("SELECT * FROM admin_menu_$lang WHERE id<=10 OR id>16 ORDER BY id", $db);
															$data = mysql_fetch_array($result);
															do{
															?>
            
            
                                                            
                                            <div class="form-group">
                                            	<label class="col-sm-12 control-label" style="text-align:left;"><?php echo $data['title'];?></label>
                                                <div class="col-sm-1" style="text-align:right; margin-top:7px;">Title:</div><div class="col-sm-11" style="margin-bottom:10px;"><input type="text" name="<?php echo $data['id'];?>_t" class="form-control" value="<?php echo $data['meta_t'];?>"></div>
                                                <div class="col-sm-1" style="text-align:right; margin-top:7px;">Description:</div><div class="col-sm-11" style="margin-bottom:10px;"><input type="text" name="<?php echo $data['id'];?>_d" class="form-control" value="<?php echo $data['meta_d'];?>"></div>
                                                <div class="col-sm-1" style="text-align:right; margin-top:7px;">Keywords:</div><div class="col-sm-11" style="margin-bottom:10px;"><input type="text" name="<?php echo $data['id'];?>_k" class="form-control" value="<?php echo $data['meta_k'];?>"></div>
                                            </div>
                                            
                                                                                            <?php	} while($data = mysql_fetch_array($result));  ?>   
                                            
                                            


                                            <input type="hidden" name="edit" value="<?php echo $id; ?>">
                                            <br>   
                                        </fieldset>
                                        
                                        <input type="submit" class="btn btn-primary btn-lg" value="Сохранить">
                                        </form>
                                   		
                                        

                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>

        </div>   

