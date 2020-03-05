<?php

header('Content-Type: application/json');
define('__ROOT__', dirname(__FILE__));

$input = filter_input_array(INPUT_POST);
$data = saveToDB($input);
echo json_encode($data);


function saveToDB($input) {
    require_once('plugins/select-plugin/php/select-settings.php'); 
    $console = "";
        
    $query = "CREATE TABLE IF NOT EXISTS `my_order` (
                a_id MEDIUMINT NOT NULL AUTO_INCREMENT,
                a_order_name CHAR(255) NOT NULL,
                a_order_id INT NOT NULL,
                a_item_id INT NOT NULL,
                a_item_table CHAR(255) NOT NULL,
                a_quantity INT NOT NULL,         
                a_date CHAR(16) NOT NULL,
                a_user_id INT NOT NULL,
                PRIMARY KEY (a_id)
            )  DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;";
    
    if ($mysqli->query($query) === TRUE) {
        $console .= "Order table created successfully" . "<br>";
    } else {
        $console .= "Error: " . $query . "<br>" . $mysqli->error . "<br>";
    }
    
    $id = 1;
    $date = $mysqltime = date("d.m.Y");     
    $username = 123;
    $query = "INSERT INTO `my_order` (a_date, a_user_id, a_order_name, a_order_id, a_item_table, a_item_id, a_quantity) VALUES ";
    $values = "";
    $template_value = "('" . $date ."', '" . $username . "', '" . $input['order']."', '".$id."',";
    
    
    foreach ($input['items'] as $nums) {
        $val = $template_value;
        foreach ($nums as $key => $value) {
            $val .=  " '" . $table_name[$key] . "',";
            foreach ($value as $info) {
                if(gettype($info) !== 'array') {
                    $val .= " '" . $info . "',";                    
                } else {
                    foreach ($info as $option) {
                        $values .= $template_value . " '" . $table_name['option'] . "', '" . $option['id'] . "', '1'),";
                    }
                }
            }
            $val = substr($val, 0, -1);
        }
        
        $values .= $val . "),";
    }
    
    $query .= substr($values, 0, -1);
    
        
    if ($mysqli->query($query) === TRUE) {
        $console .= "Item added successfully" . "<br>";
    } else {
        $console .= "Error: " . $query . "<br>" . $mysqli->error . "<br>";
    }
    
    return $console;
}