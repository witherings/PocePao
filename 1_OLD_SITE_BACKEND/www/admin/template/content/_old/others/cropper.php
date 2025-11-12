<div id="page-wrapper" class="gray-bg">
        <div class="row border-bottom">

        </div>
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>Общее</h2>
                    <ol class="breadcrumb">
                        <li>
                            <a href="index.php">Главная</a>
                        </li>
                        <li class="active">
                            <strong>Образка фото</strong>
                        </li>
                    </ol>
                </div>
            </div>
            
<div class="wrapper wrapper-content animated fadeInRight ecommerce">
        <div class="row">
            <div class="col-lg-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title  back-change">
                        <h5>Image cropper <small>http://fengyuanchen.github.io/cropper/</small></h5>
                    </div>
                    <div class="ibox-content">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="image-crop">
                                	<img src="img/p3.jpg" id="image">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="img-preview img-preview-sm"></div>
                            </div>
                        </div>
                    </div>
                    
                            </div>
                    </div>
                </div>
            </div>

        </div>
        
<?php include "template/files/footer.php"; ?>
</div>

    <!-- Mainly scripts -->
  

    <script>
        $(document).ready(function(){

            var $image = $(".image-crop > img")
            $($image).cropper({
                aspectRatio: 1.618,
                preview: ".img-preview",
                done: function(data) {
                    // Output the result data for cropping image.
                }
            });

            

        });


/*
 $(function () {
      var $previews = $('.preview');

      $('#image').cropper({
          ready: function (e) {
            var $clone = $(this).clone().removeClass('cropper-hidden');

            $clone.css({
              display: 'block',
              width: '100%',
              minWidth: 0,
              minHeight: 0,
              maxWidth: 'none',
              maxHeight: 'none'
            });

            $previews.css({
              width: '100%',
              overflow: 'hidden'
            }).html($clone);
          },

          crop: function (e) {
            var imageData = $(this).cropper('getImageData');
            var previewAspectRatio = e.width / e.height;

            $previews.each(function () {
              var $preview = $(this);
              var previewWidth = $preview.width();
              var previewHeight = previewWidth / previewAspectRatio;
              var imageScaledRatio = e.width / previewWidth;

              $preview.height(previewHeight).find('img').css({
                width: imageData.naturalWidth / imageScaledRatio,
                height: imageData.naturalHeight / imageScaledRatio,
                marginLeft: -e.x / imageScaledRatio,
                marginTop: -e.y / imageScaledRatio
              });
            });
          }
        });
    });

*/



    </script>

</body>

</html>
