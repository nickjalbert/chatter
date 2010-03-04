/*!
 * Chatter v0.1 - Chat Application.  Don't forget to include JQuery
 *                in your HTML file!
 *
 * Author: Nick Jalbert (nickjalbert@gmail.com)
 *
 */

var max_chat_window_size = 10;
var chat_display = [];

function getFormattedString(chat_item) {
    var chat_string = chat_item.name;
    chat_string += "(" + chat_item.seq + ")"
    chat_string += ": ";
    chat_string += chat_item.words;
    return chat_string;
}

function getHTMLFormatString(chat_item) {
    var html_str = "<li>";
    html_str += getFormattedString(chat_item);
    html_str += "</li>"
    return html_str;
}

function postChatLine(chat_item) {
    $("#chat_lines").append(getHTMLFormatString(chat_item));
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
    var last_seq_displayed = chat_display[chat_display.length - 1].seq;
    chat_display = data;
    correctChatDisplaySize();
    var return_idx = 0;
    while (return_idx < chat_display.length) {
        if (chat_display[return_idx].seq == last_seq_displayed) {
            return_idx++;
            break;
        }
        return_idx++;
    }
    if (return_idx == chat_display.length) {
        return_idx = 0;
    }
    return return_idx;
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
    if (chat_size > max_chat_window_size) {
        $("ul#chat_lines li:first").fadeOut("slow", 
                function () {
                $(this).remove(); 
                reapOldChat();
                });
    }
}


function sendChat() {
    var name_txt = $("#name_text").val();
    var words_txt = $("#thoughts_text").val();
    var params = {name:name_txt, words:words_txt};

    $.getJSON("cgi-bin/chat.cgi", params,
            function(data) {
            updateChatData(data);
            });

}

function initializeChat() {
    $.getJSON("cgi-bin/chat.cgi", 
            function(data) {
            updateChatData(data);
            });
}


$(document).ready(function(event) {
        $("#thoughts_text").keydown(function(event) {
            if (event.keyCode == '13') {
            sendChat();
            return false;
            }
            });
        initializeChat();
        });

