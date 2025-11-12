<?php
//---------------------------------------------------------------------------------------------------------------------
if(isset($_POST['edit'])){
	$title=$_POST['title'];
	$title = htmlentities($title, ENT_QUOTES, 'UTF-8');
	$text=$_POST['text'];
	$text = htmlentities($text, ENT_QUOTES, 'UTF-8');
	$id=$_POST['edit'];
	$query="UPDATE content SET text='$text', title='$title' WHERE id='$id'";
	//echo $query;
	if(mysql_query($query, $db)){
		echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";
	}
}

//---------------------------------------------------------------------------------------------------------------------

?>
        <div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">
                            <div class="tab-content">

															<?php

															$link="index.php?item=$item&sub=$sub";
															?>

															<form action="<?php echo $link; ?>" method="POST" enctype="multipart/form-data">
																<?php
												$result = mysql_query("SELECT * FROM content WHERE id='$id'", $db);
												$data = mysql_fetch_array($result);
												?>
                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
																			<fieldset class="form-horizontal">


	<div class="form-group">
				<div class="col-sm-12"><input type="text" name="title" class="form-control" value="<?php echo $data['title'];?>"></div>
		</div>


									<textarea class="summernote" name="text"><?php echo $data['text'];?></textarea><br>


																		<input type="hidden" name="edit" value="<?php echo $data['id']; ?>">
																		</fieldset>
                                    </div>
                                </div>


																<br>
																<input type="submit" class="btn btn-primary btn-lg" value="Сохранить">
																<a href="index.php?item=<?php echo $item; ?>" class="btn btn-default btn-lg">Отмена</a>
														 </form>
                            </div>
                    </div>
                </div>
            </div>

        </div>
