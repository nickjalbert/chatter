/*!
 * Chatter v0.1 - Chat Application.  Don't forget to include JQuery
 *                in your HTML file!
 *
 * Author: Nick Jalbert (nickjalbert@gmail.com)
 *
 */


var max_chat_window_size = 10;
var old_data = {};

function postChatLine(chat) {
    var html_chat = "<li>";
    html_chat = html_chat + chat["name"];
    html_chat = html_chat + ": ";
    html_chat = html_chat + chat["words"];
    html_chat = html_chat + "</li>";
    $("#chat_lines").append(html_chat);
}


function initializeChatData(data) {
    var x;
    $("#chat_lines").hide();
    for (x in data) {
        postChatLine(data[x]) 
    }
    $("#chat_lines").fadeIn("slow");
    reapOldChat();
    old_data = data;
}

//assume data.length >= old_data.length
function getFirstNonMatch(data) {
    var i = 0;
    while (i < old_data.length) {
        if (old_data[i]["name"] != data[i]["name"]) {
            alert(old_data[i]["name"] + data[i]["name"]);
            break;
        }
        if (old_data[i]["words"] != data[i]["words"]) {
            alert(old_data[i]["words"] + data[i]["words"]);
            break;
        }
        i++;
    }
    return i;
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

function handleChatData(data) {
    var chat_size = $("#chat_lines").children().length; 
    if (data.length >= chat_size) {
        var idx = getFirstNonMatch(data);
        alert(idx);
        while (idx < data.length) {
            postChatLine(data[idx]);
            idx++
        }
        reapOldChat();
    } else {
        initializeChatData(data);
    }
    old_data = data;
}



function sendChat() {
    var name_txt = $("#name_text").val();
    var words_txt = $("#thoughts_text").val();
    var params = {name:name_txt, words:words_txt};

    $.getJSON("cgi-bin/chat.cgi", params,
            function(data) {
            handleChatData(data);
            });

}

function initializeChat() {
    $.getJSON("cgi-bin/chat.cgi", 
            function(data) {
            initializeChatData(data);
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

