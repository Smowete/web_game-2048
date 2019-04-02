<?php

    $db = new PDO("mysql:dbname=game2048;host=<----HOST---->;charset=utf8;port=<----PORT---->", "root", "<----PASSWORD---->");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    
    //$result_PDOStatement_object = $db->query("SELECT * FROM records ORDER BY score DESC LIMIT 10");
    $result_PDOStatement_object = 
    	$db->query("SELECT username, MAX(score) AS max_score FROM records GROUP BY username ORDER BY max_score DESC LIMIT 10");
    $result = $result_PDOStatement_object->fetchAll();
    $records = array();
    foreach ($result as $row) {
        $record = array("username" => $row[0], "score" => $row[1]);
        array_push($records, $record);
    }
    print(json_encode($records));
        
       
    

?>