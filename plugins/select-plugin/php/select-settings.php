<?php

/* PHP file with database settings */

require_once(__ROOT__.'/db.php'); 


/* The name of the element in HTML 
 * and the name of the column in database are specified.
 * The HTML format of the element name: section-name-id.
*/

$row_name = array(
    "collection" => "a_collection",
    "model" => "a_model",
    "type" => "a_type",
    "pattern" => "a_pattern",
    "category" => "a_type",
    "item" => "a_item",
    "id" => "a_id",
    "price" => "a_price",
    "molding" => "a_molded"
);


/* The name of section in HTML
 * and the name of the price table are specified. 
*/

$table_name = array (
    "doar" => "a_material_price",
    "option" => "a_option_price",
    "mold" => "a_molded_price"
);