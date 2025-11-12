<?php
if($_GET['sub']=='18'){$id='42';}
if($_GET['sub']=='23'){$id='43';}

if(isset($_POST['edit'])){
	$text=$_POST['text'];
	$query="UPDATE texts SET text='$text' WHERE id='$id'";
	mysql_query($query, $db);
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

																			<?php	$link="index.php?item=$item&sub=".$_GET['sub']; ?>
																			<form action="<?php echo $link; ?>" method="POST">

                                        <fieldset class="form-horizontal">
                                            <?php
                                            $result = mysql_query("SELECT * FROM texts WHERE id='$id'", $db);
                                            $data = mysql_fetch_array($result);
                                            ?>
                                            <textarea name="text" style="width:100%;" rows="20"><?php echo $data['text'];?></textarea>


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
