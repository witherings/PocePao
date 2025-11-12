<?php
$baseurl='https://'.$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];
$main_patch=$baseurl."index.php?".$_SERVER['QUERY_STRING'];
if(isset($_GET['lang'])){$lang=$_GET['lang'];}else{$lang='ua';}

$title = 'PokePao';
if(isset($_GET['item'])){$item=$_GET['item'];}
if(isset($_GET['id'])){$id=$_GET['id'];}
if(isset($_GET['lang'])){$lang=$_GET['lang'];}
if(isset($_GET['edit'])){$edit=$_GET['edit'];}
if(isset($_GET['delete'])){$delete=$_GET['delete'];}
if(isset($_GET['type'])){$type=$_GET['type'];}
if(isset($_GET['sub'])){$sub=$_GET['sub'];}
if(isset($_GET['action'])){$action=$_GET['action'];}

if(!isset($item)){$item='1';}

$patch="template/content/";
if(isset($item)){

		$content=$patch."$item/$item.php";

		if(!file_exists($content)){
			$content=$patch."$con[0]/$con[0].php";
			if(!file_exists($content)){$content=$patch.'404.php';}
			}
}

//if($item>0 || isset($_GET['sub'])){$content=$patch.'catalog/catalog.php';}
if($item=='1'){$content=$patch.'texts/texts.php'; $sorce='home';}
if($item=='2'){$content=$patch.'edit_content.php'; $id='1';}
if($item=='3'){$content=$patch.'texts/texts.php'; $sorce='contacts';}
if($item=='18'){$content=$patch.'texts/texts.php'; $sorce='header';}
if($item=='19'){$content=$patch.'texts/texts.php'; $sorce='footer';}
if($item=='9'){$content=$patch.'texts/texts.php'; $sorce='social';}
if($item=='12'){$content=$patch.'others/pass.php';}
if($item=='11'){$content=$patch.'articles/articles.php';}
if($item=='20'){$content=$patch.'gallery/gallery.php';}



//if(isset($_GET['sub'])){$content=$patch.$item.'/'.$_GET['sub'].'.php';}
//echo $content;




?>
