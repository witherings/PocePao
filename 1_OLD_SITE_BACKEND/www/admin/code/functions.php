<?php



function date_convert($date){
$d=explode(" ", date("d m Y", $date));
$day=$d[0];
$month=$d[1];
$year=$d[2];

// Вывод даты на русском
$monthes = array(
    1 => 'Января', 2 => 'Февраля', 3 => 'Марта', 4 => 'Апреля',
    5 => 'Мая', 6 => 'Июня', 7 => 'Июля', 8 => 'Августа',
    9 => 'Сентября', 10 => 'Октября', 11 => 'Ноября', 12 => 'Декабря'
);


// Вывод дня недели
$days = array(
    'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
    'Четверг', 'Пятница', 'Суббота'
);

return $day.' '.$monthes[(date('n'))].' '.$year;
}



function photoUpload($target_dir, $file){
	//$target_dir = "uploads/";
	$target_file = $target_dir . basename($_FILES["file"]["name"]);
	echo "target_file: $target_file";
	$uploadOk = 1;
	$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

	// Check if image file is a actual image or fake image
	  $check = getimagesize($_FILES["file"]["tmp_name"]);
	  if($check !== false) {
		echo "File is an image - " . $check["mime"] . ".<br>";
		$uploadOk = 1;
	  } else {
		echo "File is not an image.<br>";
		$uploadOk = 0;
	  }

	// Check if file already exists
	if (file_exists($target_file)) {
	  echo "Sorry, file already exists.<br>";
	  $uploadOk = 0;
	}

	// Check file size
	if ($_FILES["file"]["size"] > 500000) {
	  echo "Sorry, your file is too large.<br>";
	  $uploadOk = 0;
	}

	// Allow certain file formats
	if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
	&& $imageFileType != "gif" ) {
	  echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.<br>";
	  $uploadOk = 0;
	}

	// Check if $uploadOk is set to 0 by an error
	if ($uploadOk == 0) {
	  echo "Sorry, your file was not uploaded.<br>";
	// if everything is ok, try to upload file
	} else {
	  if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
		echo "The file ". htmlspecialchars( basename( $_FILES["file"]["name"])). " has been uploaded.<br>";
	  } else {
		echo "Sorry, there was an error uploading your file.<br>";
	  }
	}
}
?>
