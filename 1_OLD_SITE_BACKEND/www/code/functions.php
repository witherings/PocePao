<?php

function get_lang($id){
	global $db;
	 $result = mysql_query("SELECT * FROM lang WHERE id='$id'", $db);
	 $data = mysql_fetch_array($result);
	 echo html_entity_decode($data['title']);
	}

	function get_content_text($id){
		global $db;
		 $result = mysql_query("SELECT * FROM content WHERE id='$id'", $db);
		 $data = mysql_fetch_array($result);
		 echo html_entity_decode($data['text']);
		}

		function get_content_title($id){
			global $db;
			 $result = mysql_query("SELECT * FROM content WHERE id='$id'", $db);
			 $data = mysql_fetch_array($result);
			 echo html_entity_decode($data['title']);
			}

		function get_title($id){
			global $db;
			 $result = mysql_query("SELECT * FROM admin_menu WHERE id='$id'", $db);
			 $data = mysql_fetch_array($result);
			 echo html_entity_decode($data['title']);
			}

function get_menu($id){
	 global $db;
	 $query="SELECT * FROM admin_menu WHERE id='$id'";
	 $result = mysql_query($query, $db);
	 $data = mysql_fetch_array($result);
	 return $data['title'];
	}


?>
