<?php

$conn = get_db_handle();

function get_db_handle() {
    $db_user = 'rik7';
    $db_pass = 'password';

    $db_driver = 'pgsql';
    $db_host = 'db.dcs.aber.ac.uk';
    $db_name = 'cs25320_19_20_rik7';
    $data_source_name = "$db_driver:host=$db_host;dbname=$db_name";
    try {

        $myPDO = new PDO($data_source_name, $db_user, $db_pass);
//        echo "worked\n";
        $getdata = $myPDO->prepare('SELECT * FROM scores ORDER BY aiscore LIMIT 8');
        $getdata->execute();
        $row = $getdata->fetchAll();
        echo '<h2>High Scores</h2>
<table class="table-responsive" width ="70%" border="1" cellpadding="5" cellspacing="5">
                <tr>
                <th>Name</th>
                <th>Player_score</th>
                <th>Ai_score</th>
                </tr>
                ';
        if ($row) {
            foreach ($row as $user) {
                echo '<tr>
                       <td>' . $user["name"] . '</td>',
                '<td>' . $user["plscore"] . '</td>',
                '<td>' . $user["aiscore"] . '</td></tr>';
            }
            echo '</table';
}

//.$user['plscore'].'-'.$user['aiscore']."<br/>";
//            }
//        } else {
//            trigger_error('No row.');
//        }

    } catch (PDOException $e) {
        echo "please work";
        // could do something more useful here
        echo $e->getMessage();
        return NULL;
    }
}