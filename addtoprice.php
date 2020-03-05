<?php

header('Content-Type: application/json');
define('__ROOT__', dirname(__FILE__));

require_once(__ROOT__.'/db.php'); 

$input = filter_input_array(INPUT_POST);
$str = "";
$query = "";
$console = "";


switch ($input['div']) {
    case "doars":
        $category = $input['category'];
        $model = explode(";", $input['model']);
        $type = explode(";", $input['type']);
        $pattern = explode(";", $input['pattern']);
        $price = intval($input['price']);

        $query = "CREATE TABLE IF NOT EXISTS a_doar_price (
                a_id MEDIUMINT NOT NULL AUTO_INCREMENT,
                a_collection CHAR(128) NOT NULL,
                a_model CHAR(128) NOT NULL,
                a_type CHAR(255) NOT NULL,
                a_pattern CHAR(255) NOT NULL,
                a_price INT NOT NULL,        
                PRIMARY KEY (a_id)
            ) DEFAULT CHARACTER SET cp1251 COLLATE cp1251_bin;";

        if ($mysqli->query($query) === TRUE) {
            $console .= "Table was created" . "<br>";
        } else {
            $console .= "Error: " . $query . "<br>" . $mysqli->error . "<br>";
        }

        foreach ($model as $mvalue) {    
            foreach ($type as $tvalue) {
                foreach ($pattern as $pvalue) {
                    $str .= "('" . $category . "', '" . $mvalue . "', '" . $tvalue . "', '" . $pvalue . "', " . $price . "), ";
                }
            }
        }
        $nstr = substr($str, 0, -2);
        $query = "INSERT INTO a_doar_price (a_collection,a_model,a_type,a_pattern,a_price) VALUES" . $nstr;
        break;
        
    case "options":
        $category = $input['category'];
        $model = explode(";", $input['model']);
        $type = explode(";", $input['type']);
        $option = explode(";", $input['option']);
        $price = intval($input['price']);
        
        $query = "CREATE TABLE IF NOT EXISTS a_option_doar_price (
                a_id MEDIUMINT NOT NULL AUTO_INCREMENT,
                a_collection CHAR(128) NOT NULL,
                a_model CHAR(128) NOT NULL,
                a_type CHAR(255) NOT NULL,
                a_item CHAR(255) NOT NULL,
                a_price INT NOT NULL,        
                PRIMARY KEY (a_id)
            ) DEFAULT CHARACTER SET cp1251 COLLATE cp1251_bin;";

        if ($mysqli->query($query) === TRUE) {
            $console .= "Table was created" . "<br>";
        } else {
            $console .= "Error: " . $query . "<br>" . $mysqli->error . "<br>";
        }
        
        foreach ($model as $mvalue) {    
            foreach ($type as $tvalue) {
                foreach ($option as $pvalue) {
                    $str .= "('" . $category . "', '" . $mvalue . "', '" . $tvalue . "', '" . $pvalue . "', " . $price . "), ";
                }
            }
        }
        $nstr = substr($str, 0, -2);
        $query = "INSERT INTO a_option_doar_price (a_collection,a_model,a_type,a_item,a_price) VALUES" . $nstr;
        break;
        
    case "molds":        
        $mold = $input['mold'];
        $type = explode(";", $input['type']);
        $pattern = explode(";", $input['pattern']);
        $price = intval($input['price']);
        
        $query = "CREATE TABLE IF NOT EXISTS a_mold_price (
                a_id MEDIUMINT NOT NULL AUTO_INCREMENT,
                a_mold CHAR(255) NOT NULL,                
                a_type CHAR(255) NOT NULL,
                a_pattern CHAR(255) NOT NULL,
                a_price INT NOT NULL,        
                PRIMARY KEY (a_id)
            ) DEFAULT CHARACTER SET cp1251 COLLATE cp1251_bin;";

        if ($mysqli->query($query) === TRUE) {
            $console .= "Table was created" . "<br>";
        } else {
            $console .= "Error: " . $query . "<br>" . $mysqli->error . "<br>";
        }
        
        foreach ($type as $tvalue) {
            foreach ($pattern as $pvalue) {
                $str .= "('" . $mold . "', '" . $tvalue . "', '" . $pvalue . "', " . $price . "), ";
            }
        }

        $nstr = substr($str, 0, -2);
        $query = "INSERT INTO a_mold_price (a_mold,a_type,a_pattern,a_price) VALUES" . $nstr;        
        break;
}

if ($mysqli->query($query) === TRUE) {
    $console .= "Item added successfully" . "<br>";
} else {
    $console .= "Error: " . $query . "<br>" . $mysqli->error . "<br>";
}
    
echo json_encode($console);