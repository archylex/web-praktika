// id value for sub-category
prevSubSelID = 0;

// selects
selected = {};


// change select item
$(document).on('change', '.js-select', function() {        
    var info = {
        "category" : $(this).data('category'),
        "name" : $(this).data('name'),
        "id" : $(this).data('id'),
        "type" : $(this).data('type')
    };
    
    var child = $(this).data('child');
    
    var next_step = false;
    var disable_step = false;
    var next_select = null;
    var forQuery = [];
        
    $('.js-select').filter(function() {       
        var select = {
            "category" : $(this).data('category'),
            "name" : $(this).data('name'),
            "id" : $(this).data('id'),
            "type" : $(this).data('type'),
            "parents" : $(this).data('parents')
        };
        
        if(select.category === info.category && select.id === info.id) {
            if (disable_step && info.type !== 'exception') {
                $(this).html('');  
                $(this).append('<option value="-">—</option>'); 
                $(this).attr('disabled', 'disabled');  
                       
            }
            
            if (next_step && info.type !== 'exception') {
                next_select = select.name;
                
                // get data and put in select
                getData(select, true, next_select, forQuery);
                
                disable_step = true;
                next_step = false;                    
            }                                          
            
            if(select.name === info.name) {
                var sl = {
                    "name" : info.name,
                    "value" : $(this).val()
                };
                forQuery.push(sl);    
                    
                next_step = true;
                
                if (typeof (child) !== 'undefined') {
                    clearTable(child);                    
                } 
                
                if (info.type === 'exception') {
                    var jsonTXT = '{"' + info.category + '":{"' + info.id + '":{"' + info.name + '":"' + $(this).val() + '"}}}'; 
                    $.extend(true, selected, JSON.parse(jsonTXT));  
                }
            }   
            
            // for query
            if(!next_step && !disable_step && select.type !== 'exception') {
                var sl = {
                    "name" : select.name,
                    "value" : $(this).val()
                };
                forQuery.push(sl);                                        
            }
            
            // for query from parent            
            if(typeof(select.parents) !== "undefined") { 
                for(var z=0; z<select.parents.length; z++) {
                    var sl = {
                        "name" : select.parents[z].name,
                        "value" : $('[data-name="' + select.parents[z].name + '"][data-category="' + select.parents[z].category + '"][data-id="' + select.parents[z].id + '"]').val()
                    };
                    forQuery.push(sl);                                        
                }
            }
        }
    }); 
    
    if (next_select === null) { 
        var rows = $(this).data('rows');
        getData(info, false, rows, forQuery);
    }
});


// button of sub-category
$('.select_button').on('click', function () {
    var parents = $(this).data('parents');
    var selects = $(this).data('selects');
    var nrows = $(this).data('rows');
    var forQuery = [];
    var id = getSubSelID();
    
    //add child to parent
    for (var x=0; x<parents.length; x++) {        
        var ps = $("select[data-category='" + parents[x].category + "'][data-id='" + parents[x].id + "'][data-name='" + parents[x].name + "']");
        var nQuery = {"name":parents[x].name, "value": ps.val()};
        forQuery.push(nQuery);
        var psc = ps.data("child");
        var childArray = new Array();
        var ext = false;

        if (typeof(psc) !== "undefined") {
            for(var z=0; z<psc.length; z++) {
                childArray.push(psc[z]);
                if(psc[z].category === selects[0].category) 
                    ext = true;
            }            
        }
        
        if (!ext)
            childArray.push(selects[0]);
        
        ps.data( "child", childArray );
        
    }    
    
    var select_html = [];
    for(var s=0; s<selects.length; s++) {
        if(s === 0) {
            select_html.push('<select class="js-select '+selects[s].category+'-'+selects[s].name+'" data-category="'+selects[s].category+'" data-name="'+selects[s].name+'" data-id="'+id+'" data-parents=\''+JSON.stringify(parents)+'\'> \n\
                            <option value="">—</option> \n\
                        </select>');            
        } else if (s === selects.length-1){
            select_html.push('<select class="js-select '+selects[s].category+'-'+selects[s].name+'" data-category="'+selects[s].category+'" data-name="'+selects[s].name+'" data-id="'+id+'" data-rows=\''+JSON.stringify(nrows)+'\' disabled> \n\
                            <option value="">—</option> \n\
                        </select>');
        } else {
            select_html.push('<select class="js-select '+selects[s].category+'-'+selects[s].name+'" data-category="'+selects[s].category+'" data-name="'+selects[s].name+'" data-id="'+id+'" disabled> \n\
                            <option value="">—</option> \n\
                        </select>');
        }
    }
    
    select_html.push('<input type="button" class="js-delrow sub-delete" value="удалить">');
    
    addRow(select_html, selects[0].category);

    selects[0].id = id;

    getData(selects[0], true, selects[0].name, forQuery);
    
});


// clear selects
function clearSelects(obj){
    var this_category = "";
    var this_id = "";
    $(obj).find('.js-select').filter(function() {
        var child = $(this).data('child');
        if (typeof (child) !== 'undefined') {
            clearTable(child);                    
        }
        
        if (!$(this).data('type') || $(this).data('type') !== 'exception') {
            if (this_category !== $(this).data('category') || this_id !== $(this).data('id')) { 
                this_category = $(this).data('category');
                this_id = $(this).data('id');                                
                $(this).val('-');
            } else {
                $(this).html('');
                $(this).append('<option value="-">—</option>');
                $(this).attr('disabled', 'disabled');  
            }             
        }
    });
    
    selected = {};
    selectCounter();    
}

function getSelectValues() {
    return selected;
}


// get data for first select
$(document).ready(function() {
    get_start();
    selectCounter();
});


// get data for select
function getData() {
    var info = arguments[0];
    var group = arguments[1];
    var row = arguments[2];
    var query = arguments[3];
    var mode = 0;
    var input = [];        

    input.push(info);
    input.push(group);
    
    /* mode:
     *   1 : first select in current category and id
     *          info, group, row
     *   0 : default select
     *          info, group, row, query
     *   2 : last select in current category and id
     *          info, group, rows, query
     */
    
    if (arguments.length === 3) {
        input.push(row);           
        mode = 1;
    } else {
        input.push(row);        
        input.push(query);        
        
        if(typeof(row) === "object") {
            mode = 2;
        } else {
            mode = 0;
        }
    } 

    console.log(input);
    $.post('plugins/select-plugin/php/select.php', {
            input: input
        },
        function(data) { console.log(data);
            
            if(mode === 0 || mode === 1) {
                $('[data-name="' + row + '"][data-category="' + info.category + '"][data-id="' + info.id + '"]').html('');
                $('[data-name="' + row + '"][data-category="' + info.category + '"][data-id="' + info.id + '"]').append('<option value="-">—</option>'); 
                $.each(data, function(i) {
                    $.each(data[i], function(key,val) { 
                        $('[data-name="' + row + '"][data-category="' + info.category + '"][data-id="' + info.id + '"]').append('<option value="' + key + '">' + val + '</option>');
                    });
                });    
                $('[data-name="' + row + '"][data-category="' + info.category + '"][data-id="' + info.id + '"]').removeAttr('disabled');
            } else if (mode === 2) {
                // data from query   
                var jsonTXT = '{"' + info.category + '":{"' + info.id + '":{';                
                for (var b=0; b<query.length; b++) {   console.log(query[b].value);   
                    var re = /"/g;
                    var result = query[b].value.replace(re, '\\"');
                    console.log(result);
                    jsonTXT += '"' + query[b].name + '":"' + result + '",';
                }
                
                for (var b=0; b<data.length; b++) {    
                    var key = Object.keys(data[b]);
                    
                    jsonTXT += '"' + key + '":"' + data[b][key] + '"';
                    if(b < data.length-1) {
                        jsonTXT += ',';
                    }
                }                
                jsonTXT += '}}}'; 

                $.extend(true, selected, JSON.parse(jsonTXT));    

            }
        }, 'json'
    );        
}


// get data for first select
function get_start() {    
    var this_category = "";
    var this_id = "";    
    
    $('.js-select').filter(function() {
        var select = $(this);
        var info = {
            "category" : select.data('category'),
            "name" : select.data('name'),
            "id" : select.data('id'),
            "type" : select.data('type')
        };
                        
        if (!info.type || info.type !== 'exception') {
            if (this_category !== info.category || this_id !== info.id) { 
                this_category = info.category;
                this_id = info.id;                
                getData(info, true, info.name);
            }               
        }
    });     
}


// counter
function selectCounter() {
    $('.js-select-counter').filter(function() {
        $(this).html('');
        for (var x=1; x<=$(this).data('counter'); x++) {
            $(this).append('<option value="' + x.toString() + '">' + x.toString() + '</option>'); 
        }
        $(this).removeAttr('disabled');
        var jsonTXT = '{"' + $(this).data("category") + '":{"' + $(this).data("id") + '":{"' + $(this).data("name") + '":"' + $(this).val() + '"}}}'; 
        $.extend(true, selected, JSON.parse(jsonTXT));  
    });
}


// add row to sub-table
function addRow(html, curCategory) {
    var table = $('#'+curCategory)[0];
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    
    if (table.style.display === "none")
        table.style.display = "table";
    
    for(var d=0; d<html.length; d++) {
        row.insertCell(d).innerHTML = html[d];
    }
}


// delete row from sub-table
function deleteRow(obj) {    
    var table = obj.closest('table')[0];
    if (table.rows.length <= 2) {
        table.style.display = "none";
    }
    var tr = obj.closest('tr')[0];
    var select = $(tr).find('.js-select:first');
    var category = select.data('category');
    var id = select.data('id');
    
    if (typeof(selected[category]) !== 'undefined' ) {
        if (typeof(selected[category][id]) !== 'undefined' ) {
            delete selected[category][id];
        }
    }
        
    obj.closest('tr').remove();            
}


// button for delete row
$(document).on('click', '.js-delrow', function() {    
    deleteRow($(this));
});


// clear sub-table
function clearTable(curCategory) {    
    for(var x=0; x<curCategory.length; x++) {
        var table = $('#'+curCategory[x].category)[0];      
        
        // delete from result        
        delete selected[curCategory[x].category];
        
        
        $(table).find('tr:gt(0)').remove();
        table.style.display = "none";
    }        
}


// get id for sub-category
function getSubSelID() {
    curSubSelID = ++prevSubSelID;
    return curSubSelID;
}