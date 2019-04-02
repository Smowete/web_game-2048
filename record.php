<?php

    $db = new PDO("mysql:dbname=game2048;host=<----HOST---->;charset=utf8;port=<----PORT---->", "root", "<----PASSWORD---->");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if (!isset($_GET["username"]) ||
        !isset($_GET["score"])
            ) {
        header("HTTP/1.1 Bad request");
        die("missing parameters");
    }
    
    $username = $_GET["username"];
    $score = $_GET["score"];
    
    $rowsAffected = $db->exec("
        INSERT INTO records
            (username, score)
        VALUES
            ('$username', '$score')
    ");
    
    print(json_encode(["result" => "success"]));



?>