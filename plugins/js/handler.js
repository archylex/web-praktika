var oddTR = false;
var scrollbarExist = false;
var itemArray = [];
var orderSum = 0;
var number = 0;


$(document).ready(function() {
    $('#option').hide();
});


$(document).on('click', '.js-modal-cancel', function() {     
    var div = $(this).closest('div');
    clearSelects(div);
});


$(document).on('click', '.js-modal-ok', function() {   
    var btn = $(this).attr('name');
    
    if (btn === 'finish-order-modal') {
        var orderName = $('input[name="order-name"]').val();        
        //addOrderToDatabase(itemArray, orderName); //not now
        
        // for print        
        if ($('input[name="print"]').prop('checked')) {
            var data = [];
            data[0] = orderName;
            data[1] = [];
            data[2] = orderSum;
            var rows = document.getElementById('doar-table').rows;    
            for(var x=0; x<rows.length; x++) {        
                var cell = rows[x].cells;
                var textItem = cell[1].innerHTML.toString().replace(/&nbsp;/g, " ");
                var itemObj = {
                    text: textItem, fontSize: 8,
                    bold: false,
                    color: 'black',
                    alignment: 'left'
                };
                data[1][x] = [];
                data[1][x].push(cell[0].innerHTML);
                data[1][x].push(itemObj);
                data[1][x].push(cell[2].innerHTML);
                data[1][x].push(cell[3].innerHTML);            
                data[1][x].push(cell[4].innerHTML); 
            }        
            pdf4print(data);
        }
        
        window.location.reload();
        
    }
    
    if (btn === 'add-element-modal') {
        var actName = $(this).data('category');
        addToOrder(actName);        
    }
    
    
    // for price dirty
    if (btn === 'add-price-modal') {
        var fields = {};
        fields['div'] = $(this).closest('div').attr('id');
        
        switch(fields['div']) {
            case "doars":
                fields['category'] = $('input[name="category"]').val();
                fields['model'] = $('input[name="model"]').val();
                fields['type'] = $('input[name="type"]').val();
                fields['pattern'] = $('input[name="pattern"]').val();
                fields['price'] = $('input[name="price"]').val();
                break;
            case "options":
                fields['category'] = $('input[name="option-category"]').val();
                fields['model'] = $('input[name="option-model"]').val();
                fields['type'] = $('input[name="option-type"]').val();
                fields['option'] = $('input[name="option-item"]').val();
                fields['price'] = $('input[name="option-price"]').val();
                break;
            case "molds":
                fields['mold'] = $('input[name="mold-item"]').val();
                fields['type'] = $('input[name="mold-type"]').val();
                fields['pattern'] = $('input[name="mold-pattern"]').val();
                fields['price'] = $('input[name="mold-price"]').val();
        }
                
        $.post('addtoprice.php', fields, function(data){ console.log(data);},'json');
        console.log(fields);
    }
    // end price 
    
    var div = $(this).closest('div');
    clearSelects(div);
        
});


// add order to database
function addOrderToDatabase(input, order_name) {
    $.post('savetodb.php', {
            items: input,
            order: order_name
        },
        function(data) { 
            console.log(data);
        }
    );
}


// add item to order table
function addToOrder(actName) {
    
    var table = $('#doar-table')[0];
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    
    var itemSelect = getSelectValues(); console.log(itemSelect);    
    var mValues = itemSelect[actName]['1'];    
    var itemObject = {};
    var item = "";
    var price = 0; 
    

    var itemarrtxt = '{ "' + actName + '" : { "id" : "' + itemSelect[actName]['1'].id + '", "counter" : "' + itemSelect[actName]['1'].counter + '"}}';     
    $.extend(true, itemObject, JSON.parse(itemarrtxt)); 
    
    if(actName === 'doar') {
        item = "Дверь&nbsp;(";
    }
    for(var key in mValues) {
        if(key !== 'price' && key !== 'id' && key !== 'counter') 
            item += mValues[key] + ", ";
    }
    item = item.substr(0, item.length-2);        
    if (actName === 'doar')
        item += ")";
    
    price += Number(mValues.price);
                
    if (actName === 'doar') {
        var startOption = true;   
        for(var key in itemSelect['option']) {
            if(startOption) {
                item += ";&nbsp;опции:";
                startOption = false;
            }
            item += "&nbsp;-&nbsp;" + itemSelect['option'][key].item + ";";
            price += Number(itemSelect['option'][key].price);
          
            var itemarrTXT = '{ "doar" : { "option" : { "' + key + '" : { "id" : "' + itemSelect['option'][key].id + '"}}}}';            
            $.extend(true, itemObject, JSON.parse(itemarrTXT));             
        }
    }
    
    itemArray.push(itemObject);        
    orderSum += mValues.counter * price;
    
    
    // add to table
    
    if (oddTR) {
        row.className = "orders_tr_two";
        oddTR = false;
    } else {
        row.className = "orders_tr_one";
        oddTR = true;
    }
    
    $('#ordersum').html(orderSum);
        
    var html = [++number, item, mValues.counter, price, mValues.counter*price]; 
    
    for(var d=0; d<html.length; d++) {
        var newcell = row.insertCell(d);
        newcell.innerHTML = html[d];
        if(d === 0) {
            newcell.className = "order_table_num";
        } else if(d === 1) {
            newcell.className = "order_table_item";
        } else {
            newcell.className = "order_price";
        }   
    }
    
    var newcell = row.insertCell(html.length);
    newcell.className = "order_action_cut";
    //newcell.innerHTML = '<input type="button" class="js-order-delrow sub-delete" value="удалить">';
    newcell.innerHTML = '<a href="#" class="js-order-delrow">удалить</a>';
        
    var scrollBarWidth = getScrollbarWidth(); 
        
    if ($('#table_content').hasScrollBar()) {
        if (!scrollbarExist) {
            $('.order_action_cut').filter(function() {
                var oldWidth = $(this).width();
                $(this).width(oldWidth - scrollBarWidth);
            });
        }
        scrollbarExist = true;
    } else {
        if (scrollbarExist) {
            $('.order_action_cut').filter(function() {
                var oldWidth = $(this).width();
                $(this).width(oldWidth + scrollBarWidth);
            });
        }
        scrollbarExist = false;
    }   
    
    $('#table_content').show();
    $('.table_header').show();
    $('#table_content_empty').hide();
}


$(document).on('click', '.js-order-delrow', function() {        
    var s = Number($(this).closest('tr')[0]['children'][3].innerHTML);
    orderSum -= s;
    --number;
    var numCell = $(this).closest('tr').find('td:first').html();    
    itemArray.splice(Number(numCell)-1, 1);    
    $('#ordersum').html(orderSum);
    $(this).closest('tr').remove();
    updateOrderTable();
});


// refresh after delete
function updateOrderTable(){
    var rows = document.getElementById('doar-table').rows;    
    oddTR = false; 

    for(var x=0; x<rows.length; x++) {
        if (oddTR) {
            rows[x].className = "orders_tr_two";
            oddTR = false;
        } else {
            rows[x].className = "orders_tr_one";
            oddTR = true;
        }
        var cell = rows[x].cells;
        cell[0].innerHTML = x + 1;
    }   
    
    if(rows.length === 0) {
        $('#table_content').hide();
        $('#table_content_empty').show();
        $('.table_header').hide();
    }
}



