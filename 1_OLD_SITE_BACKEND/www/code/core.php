<?php
if(isset($_GET['item'])){$item=$_GET['item'];}
if(isset($_GET['id'])){$id=$_GET['id'];}
if(isset($_GET['lang'])){$lang=$_GET['lang'];}
if(isset($_GET['edit'])){$edit=$_GET['edit'];}
if(isset($_GET['delete'])){$delete=$_GET['delete'];}
if(isset($_GET['type'])){$type=$_GET['type'];}
if(isset($_GET['sys_lang'])){$sys_lang=$_GET['sys_lang'];}

/*--------------------------------------------------------------------------*/

if(!$_GET['item']){$content='index'; $m1='active';}else{$item=$_GET['item']; $content='page';}
if($_GET['sub']){$sub=$_GET['sub'];}

if($item=='about'){$content=$item; $m2='active'; $title=get_menu(2);}
if($item=='contact'){$content=$item; $m3='active'; $title=get_menu(3);}


//if($item>0){}
//if(!$content){$content='page';}

//if($item=='2' && !$sub){$sub=11;}



//echo $content;
//echo $sub;
?>
