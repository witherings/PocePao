<?php
//---------------------------------------------------------------------------------------------------------------------
if(isset($_POST['edit'])){

	foreach($_POST as $key => $value)
  {
     if($key!='edit'){
			 $v=explode("_",$key);
			 $id=$v[1];
			 //echo "$key = $value <br />";
	$text = htmlentities($value, ENT_QUOTES, 'UTF-8');
	$query="UPDATE lang SET title='$text' WHERE id='$id'";
	//echo $query.'<br>';
	//if(mysql_query($query, $db)){echo "$id) - done";}else{echo "$id) - error";}echo "<br>";
	mysql_query($query, $db);
		}
	}
		echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";
}

//---------------------------------------------------------------------------------------------------------------------

?>
        <div class="wrapper wrapper-content animated fadeInRight ecommerce">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">
                            <div class="tab-content">

															<?php	$link="index.php?item=$item&sub=".$_GET['sub']; ?>

															<form action="<?php echo $link; ?>" method="POST" enctype="multipart/form-data">
																<?php
																$source='Контакты';
																$sub=$_GET['sub'];
												?>
                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
																			<fieldset class="form-horizontal">

<?php
$query="SELECT * FROM lang WHERE item='$sorce' ORDER BY id";
$result = mysql_query($query, $db);
$data = mysql_fetch_array($result);
	if($data)do{ $a++;
		$id=$data['id'];

?>
	<div class="form-group">
				<div class="col-sm-12"><input type="text" name="title_<?php echo $id;?>" class="form-control" value="<?php echo $data['title'];?>"></div>
		</div>


<?php } while($data = mysql_fetch_array($result));?>


																		</fieldset>
                                    </div>
                                </div>


																<br>
																<input type="hidden" name="edit" value="ok">
																<input type="submit" class="btn btn-primary btn-lg" value="Сохранить">
																<a href="index.php?item=<?php echo $item; ?>" class="btn btn-default btn-lg">Отмена</a>
														 </form>
                            </div>
                    </div>
                </div>
            </div>

        </div>
