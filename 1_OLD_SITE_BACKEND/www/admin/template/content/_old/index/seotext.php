<div id="page-wrapper" class="gray-bg">
        <div class="row border-bottom">

        </div>
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>Главная</h2>
                    <ol class="breadcrumb">
                        <li>
                            <a href="index.php">Главная</a>
                        </li>
                        <li>
                            Главная
                        </li>
                        <li class="active">
                            <strong>SEO текст</strong>
                        </li>
                    </ol>
                </div>
            </div>
<?php 
$id=10;
if(isset($_POST['edit'])){
	$text=$_POST['text'];
	$title=$_POST['title'];	
	if(mysql_query("UPDATE static SET title='$title', text='$text' WHERE id='$id'", $db)){
		echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";
	}
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
                                    <?php
									$result = mysql_query("SELECT * FROM static WHERE id='$id'", $db);
									$data = mysql_fetch_array($result);
									?>
									<form action="index.php?item=<?php echo $item; ?>" method="POST">
                                        <fieldset class="form-horizontal">
                                            <div class="form-group"><label class="col-sm-2 control-label">Краткий текст:</label>
                                                <div class="col-sm-10"><input type="text" name="title" class="form-control" value="<?php echo $data['title'];?>"></div>
                                            </div>
                                            <textarea class="summernote" name="text"><?php echo $data['text'];?></textarea>
                                            <input type="hidden" name="edit" value="<?php echo $id; ?>">
                                        </fieldset>
                                   		<br>     
                                        <input type="submit" class="btn btn-primary btn-lg" value="Сохранить">
                                        <a href="index.php?item=<?php echo $item; ?>" class="btn btn-default btn-lg">Отмена</a>
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
