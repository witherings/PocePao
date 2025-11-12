<div class="wrapper wrapper-content animated fadeInRight ecommerce">
        <div class="row">
            <div class="col-lg-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title  back-change">
                        <h5>Для загрузки нажмите на изображение</h5>
                    </div>
                    <div class="ibox-content">
                        <div class="row">
                        

<?php  


if($type=='about_1'){
	$sw=1200;
	$sh=371;
	$img_name="about/1";
	$pic_patch=$img;
	$back_link='index.php?item=about';
}

if($type=='about_2'){
	$sw=400;
	$sh=244;
	$img_name="about/2";
	$pic_patch=$img;
	$back_link='index.php?item=about';
}

if($type=='about_3'){
	$sw=400;
	$sh=244;
	$img_name="about/3";
	$pic_patch=$img;
	$back_link='index.php?item=about';
}

if($type=='what-we-do_all-vines'){
	$sw=1200;
	$sh=371;
	$dat=date('YmdHis');
	$db_name=$dat;
	$img_name="what-we-do/".$dat;
	$pic_patch=$img;
	$back_link='index.php?item='.$type;
	$mysql_query="UPDATE what_we_do_$lang SET img=$db_name WHERE id=1";
}

if($type=='what-we-do_horeca-consulting'){
	$sw=1200;
	$sh=371;
	$dat=date('YmdHis');
	$db_name=$dat;
	$img_name="what-we-do/".$dat;
	$pic_patch=$img;
	$back_link='index.php?item='.$type;
	$mysql_query="UPDATE what_we_do_$lang SET img=$db_name WHERE id=2";
}

if($type=='what-we-do_consulting'){
	$sw=1200;
	$sh=371;
	$dat=date('YmdHis');
	$db_name=$dat;
	$img_name="what-we-do/".$dat;
	$pic_patch=$img;
	$back_link='index.php?item='.$type;
	$mysql_query="UPDATE what_we_do_$lang SET img=$db_name WHERE id=3";
}

if($type=='calendar'){
	$sw=1200;
	$sh=371;
	$img_name="calendar/2";
	$pic_patch=$img;
	$back_link='index.php?item='.$type;
}

if($type=='calendar-item'){
	$sw=688;
	$sh=371;
	$dat=date('YmdHis');
	$db_name=$dat;
	$img_name="calendar/".$dat;
	$pic_patch=$img;
	$back_link='index.php?item=calendar';
	$mysql_query="UPDATE events_$lang SET img=$db_name WHERE id=$id";
}

if($type=='news-small'){
	$sw=375;
	$sh=210;
	$dat=date('YmdHis');
	$db_name=$dat;
	$img_name="news/".$dat;
	$pic_patch=$img;
	$back_link='index.php?item=news';
	$mysql_query="UPDATE news_$lang SET img=$db_name WHERE id=$id";
}

if($type=='news-big'){
	$sw=1137;
	$sh=509;
	$dat=date('YmdHis');
	$db_name=$dat;
	$img_name="news/".$dat;
	$pic_patch=$img;
	$back_link='index.php?item=news';
	$mysql_query="UPDATE news_$lang SET img_big=$db_name WHERE id=$id";
}

if($type=='gallery'){
	if($size==1){$sw=900; $sh=900;}
	if($size==2){$sw=900; $sh=600;}
	if($size==3){$sw=600; $sh=700;}
	$dat=date('YmdHis');
	$db_name=$dat;
	$img_name="gallery/".$dat;
	$pic_patch=$img;
	$back_link='index.php?item=gallery';
}

if($type=='contacts'){
	$sw=1200;
	$sh=420;
	$dat='1';
	$img_name="contacts/".$dat;
	$pic_patch=$img;
	$back_link='index.php?item=contacts';
}

if($type=='index'){
	$sw=1200;
	$sh=179;
	$dat='footer';
	$img_name="index/".$dat;
	$pic_patch=$img;
	$back_link='index.php?item=home';
}

if($type=='slider'){
	$sw=1200;
	$sh=371;
	$dat=date('YmdHis');
	$img_name="slider_$lang/".$dat;
	$pic_patch=$img;
	$back_link='index.php?item=home';
}

if($type=='design'){
	$sw=514;
	$sh=83;
	$dat=$name;
	$img_name="design/".$dat;
	$pic_patch="upload/design/$name.jpg";
	$back_link='index.php?item=others_design';
}

if(!isset($pic_patch)){$pic_patch="upload/holder.jpg";}
include "template/files/cropper.php";    
?>
<a href="<?php echo $back_link; ?>#pic" class="btn btn-primary btn-lg" style="margin:15px;">назад</a>

  
  

                        </div>
                    </div>
                    
                    
                    
                            </div>
                    </div>
                </div>
            </div>

