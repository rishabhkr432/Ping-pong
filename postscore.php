<?php
//$_POST['name'] = 'rik';
//$_POST['plScore'] = '3';
//$_POST['computerScore'] = '1';
$name = $_POST['name'];
$plScore = $_POST['plScore'];
$aiScore = $_POST['computerScore'];
$conn = get_db_handle($name, $plScore, $aiScore);

function get_db_handle($name, $plScore, $aiScore)
{


    $db_user = 'rik7';
    $db_pass = 'password';

    $db_driver = 'pgsql';
    $db_host = 'db.dcs.aber.ac.uk';
    $db_name = 'cs25320_19_20_rik7';
    $data_source_name = "$db_driver:host=$db_host;dbname=$db_name";
    try {
        // testing to connect the database.
        $myPDO = new PDO($data_source_name, $db_user, $db_pass);
        $myPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "Connected to database\n";

          $insert = "INSERT INTO scores(name, plScore, aiscore) VALUES(?,?,?)";
        echo "Begin inserting data\n";
        $pdoresult = $myPDO->prepare($insert);
        $pdoExec = $pdoresult->execute([
            $name, $plScore, $aiScore]);


        if ($pdoExec) {
            echo 'Data inserted';
        } else {
            echo 'Data Not Inserted';
        }
    } catch (PDOException $e) {
//        echo "please work";

        echo $e->getMessage();
        return NULL;
    }
}