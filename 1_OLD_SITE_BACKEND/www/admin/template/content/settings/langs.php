<?php
//---------------------------------------------------------------------------------------------------------------------

if(isset($_POST['edit'])){
	$id=$_POST['edit'];
	$ua=$_POST['ua'];
	$en=$_POST['en'];
		$query="UPDATE lang SET ua='$ua', en='$en' WHERE id='$id'";
	  mysql_query($query, $db);

	echo "<script>toastr.success('Запись успешно сохранена','Запись сохранена');</script>";
}

//---------------------------------------------------------------------------------------------------------------------
if(isset($action)){include "template/content/settings/$action.php";}else{?>

<style>
.nonactive{ font-style:italic; color:rgba(197,197,197,1.00);}
</style>
        <div class="wrapper wrapper-content  animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox">
                        <div class="ibox-title">
                            <h5>Список</h5>
                        </div>
                        <div class="ibox-content">

                            <div class="table-responsive">
                            <table class="table table-hover issue-tracker">
                                <tbody>
                                <tr style="font-weight:bold;">
                                	<td>#</td>
                                    <td style="width:40%">Украинский</td>
                                    <td style="width:40%">Английский</td>
                                    <td class="text-right">Действия</td>
                                </tr>
<?php
$a=0;
$result = mysql_query("SELECT * FROM lang ORDER BY id", $db);
$data = mysql_fetch_array($result);
	do{ $a++;
?>
                                <tr id="<?php echo $a;?>">
                                	<td style="width:40px;"><?php echo $a;?></td>

                                    <td><?php echo $data['ua'];?></td>
                                    <td><?php echo $data['en'];?></td>

                                    <td class="text-right">
                                         <a href="index.php?item=<?php echo $item?>&sub=<?php echo $_GET['sub'];?>&action=edit_lang&id=<?php echo $data['id']?>" class="btn btn-info"> <i class="fa fa-pencil"></i></a>
                                    </td>
                                </tr>

<?php
} while($data = mysql_fetch_array($result));  ?>
                                </tbody>
                            </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


        </div>
<?php } ?>
