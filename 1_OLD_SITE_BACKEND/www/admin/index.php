<?php 
session_start();
include "../code/db_connect.php";
if(isset($_POST['pass'])){
	$login=$_POST['login'];
	$pass=$_POST['pass'];
	$result = mysql_query("SELECT * FROM admin_users WHERE login='$login' AND password='$pass'",$db);
	$data = mysql_fetch_array($result);
	if($data){$_SESSION['admin']=1;}
}


if(isset($_SESSION['admin'])){

//-----------CONFIG

include "code/core.php";
include "code/functions.php";
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <base href="<?php echo $baseurl;?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $title; ?> | Панель управления</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link href="font-awesome/css/font-awesome.css" rel="stylesheet">
    <link href="css/plugins/toastr/toastr.min.css" rel="stylesheet">
    <link href="js/plugins/gritter/jquery.gritter.css" rel="stylesheet">
    <link href="css/plugins/sweetalert/sweetalert.css" rel="stylesheet">
    <link href="css/plugins/dropzone/basic.css" rel="stylesheet">
	<link href="css/plugins/dropzone/dropzone.css" rel="stylesheet">
    <link href="css/animate.css" rel="stylesheet">
    <link href="css/plugins/summernote/summernote.css" rel="stylesheet">
    <link href="css/plugins/summernote/summernote-bs3.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">

  <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

	<script src="js/plugins/metisMenu/jquery.metisMenu.js"></script>
    <script src="js/plugins/slimscroll/jquery.slimscroll.min.js"></script>
    <script src="js/inspinia.js"></script>
    <script src="js/plugins/pace/pace.min.js"></script>
    <script src="js/plugins/sweetalert/sweetalert.min.js"></script>
    <script src="js/plugins/toastr/toastr.min.js"></script>
    <script src="js/plugins/dropzone/dropzone.js"></script>
   	<script src="js/plugins/summernote/summernote.min.js"></script>


</head>

<body>
    <div id="wrapper">
        <?php
		//include "template/content/others/cropper.php";

		include "template/files/left_line.php";
		include "template/files/content_header.php";
		include $content;
		include "template/files/content_footer.php";
		?>
    </div>




    <script>
        $(document).ready(function(){
           $('.summernote').summernote();

		   Dropzone.options.myAwesomeDropzone = {

                autoProcessQueue: true,
                uploadMultiple: false,
                parallelUploads: 100,
                maxFiles: 100

            }


       });


function delete_item(table, id, row_id) {
    swal({

                        title: "Удалить запись?",
				        text: "Запись будет удалена без возможности восстановления!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Да, удалить!",
                        cancelButtonText: "Нет, не нужно!",
                        closeOnConfirm: false,
                        closeOnCancel: false },
                    function (isConfirm) {
                        if (isConfirm) {
							$.post("template/actions/delete.php",{ table_name:table, coll_id:id } ,function(data){
								if (data==1){
								swal("Запись удалена!", "Запись полностью удалена.", "success");
								$( "#" + row_id ).hide();
								}else{
									swal(data, "error");
									}
							});

                        } else {
                            swal("Отменено", "Вы вовремя передумали :)" + data, "error");
                        }

    });
}

	</script>

</body>
</html>
<?php } ?>
