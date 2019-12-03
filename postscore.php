<?php 

$name = pg_escape_string($_POST['name']);
$plScore =  pg_escape_string($_POST['plScore']);
$aiScore = pg_escape_string($_POST['aiScore']);



// Connecting, selecting database
$dbconn = pg_connect("host=db.dcs.aber.ac.uk port=5432 dbname=cs25320_19_20_rik7 user=rik7 password=Lcmd66JY")
    or die('Could not connect: ' . pg_last_error());

$result = pg_query($dbconn, "INSERT INTO scores(name, plScore, aiScore) VALUES('{$name}','{$plScore}','{$aiScore});");
	   
	   if (!$result) { 
            $errormessage = pg_last_error(); 
            echo "Error with query: " . $errormessage; 
            exit(); 
        } 
        pg_close(); 

// Closing connection
pg_close($dbconn);
?>
