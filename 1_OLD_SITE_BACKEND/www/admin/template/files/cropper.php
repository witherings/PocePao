<link href="cropper/css/cropper.min.css" rel="stylesheet">    
<link rel="stylesheet" href="cropper/css/main.css">
<style>
.avatar-view img{ width:<?php echo $sw; ?>px !important; height:<?php echo $sh; ?>px !important;}    
</style>
<div class="container_" id="crop-avatar">

    <!-- Current avatar -->
    <div class="avatar-view" title="">
      <img src="../<?php echo $pic_patch;?>" style="padding:3px !important; border:solid 1px #CDCDCD;">
    </div>

    <!-- Cropping modal -->
    <div class="modal fade" id="avatar-modal" aria-hidden="true" aria-labelledby="avatar-modal-label" role="dialog" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form class="avatar-form" action="cropper/crop.php" enctype="multipart/form-data" method="post">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title" id="avatar-modal-label">Загрузка изображений</h4>
            </div>
            <div class="modal-body">
              <div class="avatar-body">

                <!-- Upload image and data -->
                <div class="avatar-upload">
                  <input type="hidden" class="avatar-src" name="avatar_src">
                  <input type="hidden" class="avatar-data" name="avatar_data">
                  <input type="hidden" class="avatar-ratio" name="avatar-ratio" id="avatar-ratio" value="<?php echo $sw/$sh; ?>">
                  <input type="hidden" name="sw" id="sw" value="<?php echo $sw;?>">
                  <input type="hidden" name="sh" id="sh" value="<?php echo $sh;?>">
                  <input type="hidden" name="img_name" value="<?php echo $img_name;?>">
                  <?php if(isset($mysql_query)){?><input type="hidden" name="mysql_query" value="<?php echo $mysql_query;?>"><?php } ?>
                  <label for="avatarInput">Файл</label>
                  <input type="file" class="avatar-input" id="avatarInput" name="avatar_file" accept="image/jpeg" />
                </div>

                <!-- Crop and preview -->
                <div class="row">
                  <div class="col-md-12">
                    <div class="avatar-wrapper"></div>
                  </div>
                  <div class="col-md-12">
                    <div class="avatar-preview preview-lg"></div>
                  </div>
                </div>

                <div class="row avatar-btns">
                  <div class="col-md-12">
                    <button type="submit" class="btn btn-primary btn-block avatar-save">Готово</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div> -->
          </form>
        </div>
      </div>
    </div><!-- /.modal -->

    <!-- Loading state -->
    <div class="loading" aria-label="Loading" role="img" tabindex="-1"></div>
  </div>
  
<script src="cropper/js/cropper.min.js"></script>
<script src="cropper/js/main.js"></script> 