<?php 

$name = pg_escape_string($_POST['name']);
$plScore =  pg_escape_string($_POST['plScore']);
$aiScore = pg_escape_string($_POST['aiScore']);



// Connecting, selecting database
$dbconn = pg_connect("host=localhost port=5432 dbname=postgres user=postgres password=Rishabh11@")
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
