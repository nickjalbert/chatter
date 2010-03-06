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

function getFormattedString(chat_item) {
    var chat_string = chat_item.name;
    chat_string += " (" + chat_item.time.split(" ")[1] + ")";
    chat_string += ": ";
    chat_string += chat_item.words;
    return chat_string;
}

function getHTMLFormatString(chat_item) {
    var html_str = "<li style='display:none'>";
    html_str += getFormattedString(chat_item);
    html_str += "</li>"
    return html_str;
}

function postChatLine(chat_item) {
    $("#chat_lines").append(getHTMLFormatString(chat_item));
    $("ul#chat_lines li:last").fadeIn("slow"); 
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

function updateChatDisplay(update_idx) {
    while (update_idx < chat_display.length) {
        postChatLine(chat_display[update_idx]);
        update_idx++;
    }
    reapOldChat();
}

function updateChatData(data) {
    var update_idx = setChatData(data);
    updateChatDisplay(update_idx);
}

function reapOldChat() {
    var chat_size = $("#chat_lines").children().length; 
    if (chat_size > chat_display.length) {
        $("ul#chat_lines li:first").fadeOut("slow", 
                function () {
                $(this).remove(); 
                reapOldChat();
                });
    }
}

function placeOtterImageRandomly() {
    var width_buffer = 150;
    var total_images = 10;
    
    var height = $(window).height()
    var width = $(window).width()
    var placement_h = Math.floor(Math.random() * height);
    var placement_w = Math.floor(Math.random() * (width - width_buffer));
    placement_w += width_buffer;
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
    
    $.post("write.php", params);
    refreshChat();

}

function refreshChat() {
    $.getJSON("read.php", 
            function(data) {
            updateChatData(data);
            });
}

function resetChat(event) {
    event.preventDefault();
    $.post("reset.php");
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


$(document).ready(function(event) {
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

