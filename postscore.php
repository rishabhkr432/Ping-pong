<?php 
$dbconn = pg_connect("host=localhost port=5432 dbname=postgres user=postgres password=Rishabh11@")
    or die('Could not connect: ' . pg_last_error());
	
if(!empty($_POST["name"] || $_POST["plScore"] || $_POST["aiScore"])){
	
}
else{
	echo "No data";
	die();
}
$sql = "INSERT INTO scores (name, plScore, aiScore)
		values('$name','$plScore','$aiScore')";
		if($dbconn->query($sql)){
			echo "new record added";
		}
		else{
			echo "Error";
		}
?>
