<?php 


// Connecting, selecting database
$dbconn = pg_connect("host=localhost port=5432 dbname=postgres user=postgres password=Rishabh11@")
    or die('Could not connect: ' . pg_last_error());

$query = 'SELECT * FROM  scores';

$result = pg_query($query) or die('Query failed: ' . pg_last_error());

if (!$dbconn){
echo "<center><h1>Doesn't work =(</h1></center>";
}else
 echo "<center><h1>Good connection</h1></center>";
pg_close($dbconn);

// next lines are reused
if( $_GET["name"] || $_GET["plScore"] || $_GET["aiScore"])
{
echo "Welcome: ". $_GET['name']. "<br />";
echo "Your score is: ". $_GET["plScore"]. "<br />";
echo "Your opponent score is: ". $_GET["aiScore"];
echo ($result);
pg_free_result($result);

echo '</table></body></html>';
?>