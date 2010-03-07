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
var title_text = "Otter Chat!"

function getFormattedString(chat_item) {
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

function postChatLine(chat_item) {
    $("#words").append(getHTMLFormatString(chat_item));
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

function safeUnbindBlink(event, blinkInterval) {
    clearInterval(blinkInterval);
    $("#otter_title").text(title_text);
    $("#chatter").unbind(focusin);
}

function updateChatDisplay(update_idx) {
    var executedAtleastOnce = false;
    var nonzeroUpdate = true;
    if (update_idx == 0) {
        nonzeroUpdate = false;
    }
    while (update_idx < chat_display.length) {
        postChatLine(chat_display[update_idx]);
        update_idx++;
        executedAtleastOnce = true;
    }
    if (executedAtleastOnce && nonzeroUpdate && ! title_is_blinking && ! chatter_has_focus) {
        var blinkInterval = setInterval("titleBlink()", 2000);
        $("#chatter").focusin(function(event) {
                clearInterval(blinkInterval);
                $("#otter_title").text(title_text);
                $(this).unbind(event);
        });
    }
    reapOldChat();
}

function updateChatData(data) {
    var update_idx = setChatData(data);
    updateChatDisplay(update_idx);
}

function reapOldChat() {
    var chat_size = $("#words").children().length; 
    if (chat_size > chat_display.length) {
        $("div#words .chat_item:first").fadeOut("slow", 
                function () {
                $(this).remove(); 
                reapOldChat();
                });
    }
}

function placeOtterImageRandomly() {
    var total_images = 10;
    
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
    $.post("php/reset.php");
    refreshChat();
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


function focusInChatArea(event) {

}


$(document).ready(function(event) {
        $("#chatter").draggable();
        $("#chatter").resizable();

        $("#chatter").focusin(function(event) {
            chatter_has_focus = true;
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

        refreshChat();
        setInterval("refreshChat()", 2000);
        });

