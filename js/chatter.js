/*!
 * Chatter v0.1 - Chat Application.  Don't forget to include JQuery
 *                in your HTML file!
 *
 * Author: Nick Jalbert (nickjalbert@gmail.com)
 *
 */

var max_chat_window_size = 10;
var chat_display = [];
var otter_enabled = true;
var chatter_has_focus = false;
var title_is_blinking = false;
var sound_enabled = true;
var title_text = "Otter Chat!"

function getFormattedString(chat_item) {
    if (chat_item == null){
        return "&nbsp;";
    }
    var chat_string = chat_item.name;
    chat_string += " (" + chat_item.time.split(" ")[1] + ")";
    chat_string += ": ";
    chat_string += chat_item.words;
    return chat_string;
}

function getHTMLFormatString(chat_item) {
    var html_str = "<div class='chat_item' style='display:none'>";
    html_str += getFormattedString(chat_item);
    html_str += "</div>"
    return html_str;
}

function postEmptyChatDiv() {
    $("#words").append(getHTMLFormatString(null));
}

function postInvisibleChatDiv(htmlstr) {
    $("#words").append(htmlstr);
}

function postChatLine(chat_item) {
    postInvisibleChatDiv(getHTMLFormatString(chat_item));
    $("div#words .chat_item:last").fadeIn("slow"); 
}

function correctChatDisplaySize() {
    while (chat_display.length > max_chat_window_size) {
        chat_display.shift();
    }
}

function setChatData(data) {
    if (chat_display.length == 0) {
        chat_display = data
        correctChatDisplaySize()
        return 0;
    }
    var last_seq_displayed = chat_display[chat_display.length - 1].seqnum;
    chat_display = data;
    correctChatDisplaySize();
    var return_idx = 0;
    while (return_idx < chat_display.length) {
        if (chat_display[return_idx].seqnum == last_seq_displayed) {
            return_idx++;
            return return_idx;
        }
        return_idx++;
    }
    return 0;
}


function playMessageSound() {
    if(! chatter_has_focus && sound_enabled) {
        $("#jpId").jPlayer( "play");
    }
}


function startTitleBlink() {
    if (! title_is_blinking && ! chatter_has_focus) {
        var blinkInterval = setInterval("titleBlink()", 2000);
        $("#chatter").focusin(function(event) {
                clearInterval(blinkInterval);
                $("#otter_title").text(title_text);
                $(this).unbind(event);
        });
    }
}

function updateChatDisplayPrototype(update_idx) {
    /* Assumes the invariant that there 
     * will be max_chat_window_size chat_items
     */
    var receivedMessage = false; 
    var chat_display_offset = max_chat_window_size - chat_display.length
    var chat_display_idx = 0;
    $("#words > .chat_item").each(function(index) {
            if (chat_display_offset > 0) {
            $(this).fadeOut("slow", function() {
                $(this).html(getFormattedString(null));
                $(this).fadeIn("slow");
                });
                chat_display_offset--;
            } else {
                var current_element = chat_display[chat_display_idx];
                var current_string = getFormattedString(current_element);
                if (current_string != $(this).html()) {
                    receivedMessage = true;
                } else {
                    receivedMessage = false;
                }
                $(this).html(current_string);
                chat_display_idx++;
            }
        
            });
    if (receivedMessage) {
        playMessageSound();
        startTitleBlink();
    }
}

function updateChatDisplay(update_idx) {
    var receivedMessage = false;

    if (update_idx != 0 && update_idx < chat_display.length) {
        receivedMessage = true;
    }
    while (update_idx < chat_display.length) {
        postChatLine(chat_display[update_idx]);
        update_idx++;
    }
    if (receivedMessage) {
        playMessageSound();
        startTitleBlink();
    }
    reapOldChat();
}

function updateChatData(data) {
    var update_idx = setChatData(data);
    updateChatDisplayPrototype(update_idx);
}

function reapOldChat() {
    var chat_size = $("#words > .chat_item").size()
    if (chat_size > chat_display.length) {
        $("div#words .chat_item:first").fadeOut("slow", 
                function () {
                $(this).remove(); 
                reapOldChat();
                });
    }
}

function placeOtterImageRandomly() {
    var total_images = 23;
    
    var height = $(window).height()
    var width = $(window).width()
    var placement_h = Math.floor(Math.random() * height);
    var placement_w = Math.floor(Math.random() * width);
    var otter_number = Math.floor(Math.random() * (total_images + 1));

    var img_html = "<img src='img/otter" + otter_number + ".jpg'";
    img_html += " style='position:absolute;top:" + placement_h;  
    img_html += "px;left:" + placement_w + "px' ";
    img_html += "class='otterpic'/>"
    $("body").append(img_html);
    $("img").click(function() {
        $(this).fadeOut("slow", function() { $(this).remove()});
    });

}


function sendChat() {
    var name_txt = $("#name_text").val();
    var words_txt = $("#thoughts_text").val();
    var params = {name:name_txt, words:words_txt};
    $("#thoughts_text").val("");
    if (otter_enabled) {
        placeOtterImageRandomly();
    }
    
    $.post("php/write.php", params);
    refreshChat();

}

function refreshChat() {
    $.getJSON("php/read.php", 
            function(data) {
            updateChatData(data);
            });
}

function resetChat(event) {
    event.preventDefault();
    $.post("php/reset.php", function() {
        resetChatArea();
    });
    ///refreshChat();
}

function otterToggle(event) {
    event.preventDefault();
    if (otter_enabled) {
        $(".otterpic").each(function() {
            $(this).fadeOut("slow", function () {
                $(this).remove(); 
            });
        });
        $("#otter_link").text("Turn otters on!");
        otter_enabled = false;
    } else {
        otter_enabled = true;
        $("#otter_link").text("Turn otters off");
    }
    refreshChat();
}

function soundToggle(event) {
    event.preventDefault();
    if (sound_enabled) {
        $("#sound_link").text("Turn sound on");
        sound_enabled = false;
    } else {
        $("#sound_link").text("Turn sound off");
        sound_enabled = true;
    }
}

function chatAction(event) {
    if (event.keyCode == '13') {
        event.preventDefault();
        sendChat();
    }
}

function nameTextAction(event) {
    if (event.keyCode == '13') {
        event.preventDefault();
    }
}

function titleBlink() {
    if ($("#otter_title").text() == title_text) {
        $("#otter_title").text("You Have an Otter Message...");
    } else {
        $("#otter_title").text(title_text);
    }

}

function prepareChatArea() {
    var i = 0;
    while (i < max_chat_window_size) {
        postEmptyChatDiv();
        $("div#words .chat_item:last").fadeIn("slow"); 
        i++;
    }
}

function resetChatArea() {
    var chat_items = $("#words > .chat_item").each(function() {
        $(this).fadeOut("slow", function() {
            $(this).html(getFormattedString(null));
            $(this).fadeIn("slow");
        });
        
    });
}

$(document).ready(function(event) {
        prepareChatArea();
        var padding = "10px";
        $("#chatter").corners(padding);
        $("#words").corners(padding + " top");
        $("#thoughts").corners(padding + " bottom");

        $("#chatter").draggable();
        //$("#chatter").resizable();

        $("#chatter").focusin(function(event) {
            chatter_has_focus = true;
        });

        $("#jpId").jPlayer( {
            ready: function () {
                this.element.jPlayer("setFile", "img/otter-sound.mp3");
            }
            });

        $("#otter_title").text(title_text);
        
        $("#chatter").focusout(function(event) {
            chatter_has_focus = false;
        });


        $("#name_text").keydown(function(event) {
            nameTextAction(event);
            });

        $("#thoughts_text").keydown(function(event) {
            chatAction(event);
            });

        $("#reset_link").click(function(event) {
            resetChat(event);
            });

        $("#otter_link").click(function(event) {
            otterToggle(event);
            });

        $("#sound_link").click(function(event) {
            soundToggle(event);
            });


        refreshChat();
        setInterval("refreshChat()", 2000);
        });

