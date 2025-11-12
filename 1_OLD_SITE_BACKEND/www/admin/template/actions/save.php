<?php
$vars=$_POST['vars'];
$t=explode('_',$vars);
$id=$t[0];
$star=$t[1];
include "db_connect3.php";
if(mysql_query("UPDATE experts2 SET stars='$star' WHERE id='$id'", $db3)){echo '1';}
?>
