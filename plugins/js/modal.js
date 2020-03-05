var display_modal = false;

function show_modal(what){
    if(!display_modal){  
        $("#tint-modal").css({  
            "opacity": "0.7"  
        });  
        $("#tint-modal").fadeIn("slow");  
        $(what).fadeIn("slow");  
        display_modal = true;  
    }  
}

function hide_modal(what){  
    if(display_modal){  
        $("#tint-modal").fadeOut("slow");  
        $(what).fadeOut("slow");  
        display_modal = false;  
    }  
}

function center_modal(what){  
    var windowWidth = document.documentElement.clientWidth;  
    var windowHeight = document.documentElement.clientHeight;  
    var modalHeight = $(what).height();  
    var modalWidth = $(what).width();  
    
  
    $(what).css({  
        "position": "absolute",  
        "top": windowHeight/2 - modalHeight/2 - 100,
        "left": windowWidth/2 - modalWidth/2  
    });  
  
    $("#tint-modal").css({  
        "height": windowHeight  
    });  
}

$(document).ready(function(){
    $(".js-modal-show").click(function(){
        var modal = "#" + $(this).attr('name');
        center_modal(modal);
        show_modal(modal);
    });
          
    $(".js-modal-hide").click(function(){
        var modal = "#" + $(this).attr('name');
        hide_modal(modal);
        
        /*if($(this).attr('name') === "add-element-modal")
            clear_selects();*/
    });    
});

