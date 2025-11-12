<!-- slider-area start -->
<div class="slider-area">
  <img src="assets/images/service_logo.png" class="service_logo">
    <div class="slider-active">
  <?php
    $result = mysql_query("SELECT * FROM slider ORDER BY id", $db);
    $data = mysql_fetch_array($result);
    if($data)do{
  ?>
        <div class="slider-items">
            <img src="assets/images/slider/<?php echo $data['img']?>" alt="" class="slider">
            <div class="slider-contents">
                <div class="container">
                    <div class="row">
                        <div class="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">

                            <h3><?php echo $data['text']?></h3>

                        </div>
                    </div>
                </div>
            </div>
        </div>
      <?php	} while($data = mysql_fetch_array($result));  ?>
    </div>
</div>
<!-- slider-area end -->

<!-- service-area start -->
<div class="service-area">
    <div class="container">
        <div class="row">
            <div class="col-md-4 col-sm-6 col-xs-12">
                <div class="service-wrap text-center sm-mb-30 xs-mb-30">
                    <span><img src="assets/images/icons/1.png"></span>
                    <h2><?php get_lang(11);?></h2>
                    <p><a href="<?php get_lang(12);?>" target="_blank"><?php get_lang(13);?></a></p>
                </div>
            </div>
            <div class="col-md-4 col-sm-6 col-xs-12">
                <div class="service-wrap active text-center sm-mb-30 xs-mb-30">
                    <span><img src="assets/images/icons/2.png"></span>
                    <h2><?php get_lang(14);?></h2>
                    <p><?php get_lang(15);?></p>
                </div>
            </div>
            <div class="col-md-4 col-sm-6 col-xs-12">
                <div class="service-wrap text-center">
                    <span><img src="assets/images/icons/3.png"></span>
                    <h2><?php get_lang(16);?></h2>
                    <p><?php get_lang(17);?></p>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- service-area end -->



<!-- quote-area start -->
<div class="quote-area black-opacity bg-img-1 quote-area2">
    <div class="container">
        <div class="row">
            <div class="col-xs-12">
                <div class="quote-wrap text-center">
                    <h2><?php get_lang(18);?></h2>
                    <h3><?php get_lang(19);?></h3>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- quote-area end -->


<!-- .booking-area start -->
  <a name="form"></a>
<div class="booking-area">
    <div class="booking-images">
        <img src="assets/images/banners/v5.jpg" alt="">
    </div>
    <div class="container booking">
        <div class="row">
            <div class="col-md-6 col-md-offset-6 col-sm-9 col-xs-12">
                <div class="booking-wrap">
                    <div class="section-title">
                        <h2><?php get_lang(20);?></h2>
                        <h3><?php get_lang(21);?></h3>
                    </div>


                    <form action="index.php#form" method="post">
                        <div class="row">
                            <div class="col-md-12  col-sm-12 col-xs-12">
                                <p><?php get_lang(22);?></p>
                                <input type="text" name="fio" placeholder="<?php get_lang(23);?>">
                            </div>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <p><?php get_lang(26);?></p>
                                <input type="text" name="persons" placeholder="<?php get_lang(26);?>">
                            </div>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <p>Telefon</p>
                                <input type="text" name="phone" placeholder="Telefon">
                            </div>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <p><?php get_lang(24);?></p>
                                <input type="date" name="date">
                            </div>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                              <p><?php get_lang(27);?></p>
                              <input type="time" name="time">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 col-sm-5 col-xs-12">
                                <input type="submit" class="booknow-btn submit" value="<?php get_lang(28);?>">
                            </div>
                            <div class="col-md-7 col-sm-7 col-xs-12">
                              <?php
                              if($_POST['fio']){

                                  // Ваш токен
                                  $token = "7874332998:AAEjVN5tyTSQtvAtRWQv296Xd3h95snX1oE";

                                  // ID чата
                                  //$chat_id = "518341168";
                                  $chat_id = "1637641074";


                                  // Текст сообщения
                                  $message = "Vor- und Nachname: ".$_POST['fio']."\n";
                                  $message .= "Anzahl der Personen: ".$_POST['persons']."\n";
                                  $message .= "Datum: ".$_POST['date']."\n";
                                  $message .= "Uhrzeit: ".$_POST['time'];
                                  $message .= "Telefon: ".$_POST['phone'];

                                  // URL API
                                  $url = "https://api.telegram.org/bot$token/sendMessage";

                                  // Параметры запроса
                                  $data = array(
                                      'chat_id' => $chat_id,
                                      'text' => $message
                                  );

                                  // Инициализация cURL
                                  $ch = curl_init();
                                  curl_setopt($ch, CURLOPT_URL, $url);
                                  curl_setopt($ch, CURLOPT_POST, true);
                                  curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
                                  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

                                  // Выполнение запроса и получение результата
                                  $response = curl_exec($ch);
                                  curl_close($ch);

                                  // Вывод результата (можно закомментировать)
                                  //echo $response;?>
                                  <span class='form-result'><?php get_lang(29);?></span>
                            <?php  }  ?>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

</div>
<!-- .booking-area end -->

<div class="gallary-area gallary-area2">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="section-title text-center">
                            <h2>Unsere Highlights – frisch, bunt, köstlich</h2>
                            <h3>Entdecke unsere beliebtesten Kreationen, zubereitet mit Liebe und den besten Zutaten</h3>
                        </div>
                    </div>
                </div>
                <div class="row grid" style="position: relative; height: 955.938px;">
                  <?php
                    $result = mysql_query("SELECT * FROM gallery ORDER BY id DESC", $db);
                    $data = mysql_fetch_array($result);
                    if($data)do{
                  ?>
                    <div class="col-md-4 portfolio col-sm-6 col-xs-12 col-2">
                        <div class="galary-wrap">
                            <img src="assets/images/gallary/<?php echo $data['img'];?>" alt="" width="360">
                            <a href="assets/images/gallary/<?php echo $data['img'];?>" class="popup">+</a>
                        </div>
                    </div>
                    <?php	} while($data = mysql_fetch_array($result));  ?>



                </div>
            </div>
        </div>
