<?php
$result = mysql_query("SELECT * FROM admin_menu WHERE sub='0' ORDER BY id", $db);
$data = mysql_fetch_array($result);
	do{
	$menu_id=$data['id'];
	$title=$data['title'];
	$link=$data['id'];

	//if(!file_exists($patch.$link)){mkdir($patch.$link, 0700);}

	$status='';
	$collapse='collapse';
	$sub=0;

	$results = mysql_query("SELECT * FROM admin_menu WHERE sub='$menu_id' ORDER BY id", $db);
	$datas = mysql_fetch_array($results);
	if($datas){	$sub=1; }

	if(isset($_GET['item'])){
		$it=explode('-', $_GET['item']);
		if($it[0]==$link){$status='active';}
	}

?>
                    <li class="<?php echo $status;?>">
                        <a href="index.php?item=<?php echo $link;?>"><i class="fa fa-circle-thin"></i> <span class="nav-label"><?php echo $title;?></span> <?php if($sub==1) {?><span class="fa arrow"></span><?php } ?></a>
                        <?php if($sub==1){ ?>
                        <ul class="nav nav-second-level <?php echo $collapse; ?>">
                        <?php
						$results = mysql_query("SELECT * FROM admin_menu WHERE sub='$menu_id' ORDER BY id", $db);
						$datas = mysql_fetch_array($results);
						do{
						$sub_title=$datas['title'];
						$sub_link=$datas['id'];
						$sub_status='';
						if($_GET['sub']==$sub_link){$sub_status='active'; }
						?>

                            <li class="<?php echo $sub_status;?>"><a href="index.php?item=<?php echo $link.'&sub='.$sub_link;?>"><?php echo $sub_title;?></a></li>

                        <?php } while($datas = mysql_fetch_array($results)); echo '</ul>'; } ?>
                    </li>



<?php	} while($data = mysql_fetch_array($result)); ?>
