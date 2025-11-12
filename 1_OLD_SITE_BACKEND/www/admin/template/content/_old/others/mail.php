<div id="page-wrapper" class="gray-bg">
        <div class="row border-bottom">

        </div>
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>Общее</h2>
                    <ol class="breadcrumb">
                        <li>
                            <a href="index.php">Главная</a>
                        </li>
                        <li class="active">
                            <strong>Адрес для формы</strong>
                        </li>
                    </ol>
                </div>
            </div>
<?php 
$id=2;
if(isset($_POST['edit'])){
	$text=$_POST['text'];
	mysql_query("UPDATE static SET text='$text' WHERE id='7'", $db);
	echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";
	
} 
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
                                   
                                    
									<form action="index.php?item=<?php echo $item; ?>" method="POST">
                                        <fieldset class="form-horizontal">
                                            <?php
                                            $result = mysql_query("SELECT * FROM static WHERE id='7'", $db);
                                            $data = mysql_fetch_array($result);
                                            ?>
                                            <div class="form-group"><label class="col-sm-2 control-label">Email:</label>
                                                <div class="col-sm-10"><input type="text" name="text" class="form-control" value="<?php echo $data['text'];?>"></div>
                                            </div>


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



<?php include "template/files/footer.php"; ?>
</div>
