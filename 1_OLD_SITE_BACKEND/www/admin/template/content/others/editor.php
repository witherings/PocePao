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
		$m_n=$_POST[$value.'_n'];
		//echo "$value | $m_n <br />"; 
		mysql_query("UPDATE admin_menu_$lang SET title='$m_n' WHERE id='$value'", $db);
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
															$result = mysql_query("SELECT * FROM admin_menu_$lang WHERE id<=10 ORDER BY id", $db);
															$data = mysql_fetch_array($result);
															do{
															?>
            
            
                                                            
                                            <div class="form-group">
												<div class="col-sm-12"><input type="text" name="<?php echo $data['id'];?>_n" class="form-control" value="<?php echo $data['title'];?>"></div>
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

