
            
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
                                <div class="img-preview img-preview-sm" style="width:100px; height:300px;"></div>
                                <br><br>
                                <div class="btn-group">
                                    <label title="Upload image file" for="inputImage" class="btn btn-primary">
                                        <input type="file" accept="image/*" name="file" id="inputImage" class="hide">
                                        Загрузить
                                    </label>
                                    <label  id="download" class="btn btn-primary">Сохранить</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                    
                            </div>
                    </div>
                </div>
            </div>



    <!-- Mainly scripts -->
  

    <script>
        $(document).ready(function(){
			w = 100;
			h = 300;
			ar = w/h;
            var $image = $(".image-crop > img")
            $($image).cropper({
                //aspectRatio: 1.618,
				aspectRatio: ar,
				minCropBoxWidth: 100,
				minCropBoxHeight: 300,
                preview: ".img-preview",
                done: function(data) {}
            });

			

 var $inputImage = $("#inputImage");
            if (window.FileReader) {
                $inputImage.change(function() {
                    var fileReader = new FileReader(),
                            files = this.files,
                            file;

                    if (!files.length) {
                        return;
                    }

                    file = files[0];

                    if (/^image\/\w+$/.test(file.type)) {
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function () {
                            $inputImage.val("");
                            $image.cropper("reset", true).cropper("replace", this.result);
                        };
                    } else {
                        showMessage("Please choose an image file.");
                    }
                });
            } else {
                $inputImage.addClass("hide");
            }

            $("#download").click(function() {
				var cropcanvas = $image.cropper("getDataURL")
				$.ajax({
				type: 'POST',
				url: 'template/actions/savecropimage.php',
				data: {
				pngimageData: cropcanvas,
				filename: '../../test.png'
				},
				success: function(output) {
					toastr.success('Изображение успешно соxранено');
				}
				})
            });

        });
		



    </script>

