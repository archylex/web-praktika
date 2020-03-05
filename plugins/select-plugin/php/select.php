<?php

header('Content-Type: application/json');
define('__ROOT__', dirname(dirname(dirname(dirname(__FILE__))))); 

$input = filter_input_array(INPUT_POST);
$data = getData($input);
echo json_encode($data);


// getData function
function getData($input) {
    
    require_once(__ROOT__.'/plugins/select-plugin/php/select-settings.php'); 
    
    // create query    
    $iInfo = $input['input'][0];
    $iGroup = $input['input'][1];
    $iRows = $input['input'][2]; 
    $iQuery = isset($input['input'][3]) ? $input['input'][3] : ''; 
    $table = $table_name[$iInfo['category']];
    $field_rows = "";
    $sql = "";
    $data = array();   
    
    if (gettype($iRows) === "array") {
        $iGroup = FALSE;        
        foreach ($iRows as $row) {
            if(empty($field_rows)) {
                $field_rows = "`".$row_name[$row]."`";
            } else {
                $field_rows .= ",`".$row_name[$row]."`";
            }
        }        
    } else {
        $field_rows = "`".$row_name[$iRows]."`";        
    }        
    
    if(!empty($iQuery)) {
        foreach ($iQuery as $field) {
            if(empty($sql)) {
                $sql = " WHERE `".$row_name[$field['name']]."`='".$field['value']."'";
            } else {
                $sql .= " AND `".$row_name[$field['name']]."`='".$field['value']."'";
            }        
        }
    }
    
    if ($iGroup) {
        $sql .= " GROUP BY ".$field_rows." HAVING COUNT(*)>0";
    } 
    
    $query = "SELECT ".$field_rows." FROM ".$table.$sql;
    
    $result = $mysqli->query($query);   

    if ($result) {
        
        while ($row = $result->fetch_object()){ 
            if (gettype($iRows) === "array") {
                foreach ($iRows as $arow) {
                    $nv = $row_name[$arow];
                    $newarow = str_replace('"', '&quot;', $arow);
                    $new_element = [$newarow => $row->$nv];                                
                    array_push($data, $new_element);              
                }
            } else {      
                $key = $row_name[$iRows];
                $val = $row_name[$iRows];
                $new_key = str_replace('"', '&quot;', $row->$key);
                $new_element = [$new_key => $row->$val];                
                array_push($data, $new_element);                
            }
        }        
        $result->close();        
    }
    
    return $data;
}