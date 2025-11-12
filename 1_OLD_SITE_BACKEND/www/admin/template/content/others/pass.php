<?php
$id=9;
if(isset($_POST['edit'])){
	$password=$_POST['password'];
	mysql_query("UPDATE admin_users SET password='$password' WHERE id='2'", $db);
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
                                            $result = mysql_query("SELECT * FROM admin_users WHERE id='2'", $db);
                                            $data = mysql_fetch_array($result);
                                            ?>
                                            <div class="form-group"><label class="col-sm-2 control-label">Пароль:</label>
                                                <div class="col-sm-10"><input type="text" name="password" class="form-control" value="<?php echo $data['password'];?>"></div>
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
