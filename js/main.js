var streamerID = "Drache_Offiziell";
var streamerOnline = false;
var playerOnline = false;
var firstDone = false;
var intervalID = -1;
var currentPlayer = null;

$(document).ready(function () {
    currentPlayer = new YouNowPlayer();
    $('#streamerID').val(streamerID);
    $('#connect').click(function () {
        currentPlayer.connect($('#streamerID').val(), 0);
    });
});
function toogle_chat() {
    if ($('#chat').width() == 0) {
        $('#footer2').css("background-color", "#333");
        $('#chat').show();
        $('#chat').width(350);
        $('#stream').position("left");
        var newWidth = ( $(window).width() - 355);
        $('#stream').width(newWidth);
        $('#stream').position("left");
    } else {
        $('#footer2').css("background-color", "#666");
        $('#chat').hide();
        $('#chat').width(0);
        $('#stream').width("100%");
    }

}

function Reconnect() {
    currentPlayer = new YouNowPlayer();
    currentPlayer.connect($('#streamerID').val(), 1);
}
function switchModus() {
    if ($('#reconnectCheckbox').prop('checked')) {
        checkIfOnline();
    }
    if (!$('#reconnectCheckbox').prop('checked')) {
        console.log("INTERVALL CLEARED: " + intervalID);
        clearInterval(intervalID);
    }
}
function getStreamerStatus() {
    var self = this;
    streamerID = $('#streamerID').val();
    console.log("StreamerID: "+streamerID);
    console.log(" ");
    $.ajax({
        url: 'https://api.younow.com/php/api/broadcast/info/curId=0/user=' + streamerID,
        jsonp: "callback",
        dataType: "jsonp",
        success: function (json, b, c) {
            if (json["errorCode"] > 0) {
                streamerOnline = false;
            } else {
                streamerOnline = true;
            }
        }
    });
}

function checkIfOnline() {
    if (!firstDone) {
        firstDone = true;
    }
    if ($('#reconnectCheckbox').prop('checked')) {
        intervalID = setInterval(function () {
            console.log("PlayerStatus:" + playerOnline);
            if (streamerOnline && !playerOnline) {
                Reconnect();
            } else if (playerOnline && !streamerOnline) {
                console.log("StreamerStatus:" + streamerOnline);
                currentPlayer.disconnect();
            } else {
                console.log("StreamerStatus:" + streamerOnline);
            }
            getStreamerStatus()
        }, 5000);
    }
}
checkIfOnline();

function streaminfo () {
    w = 900
    h = 250
    x = screen.availWidth/2-w/2;
    y = screen.availHeight/2-h/2;
    var popupWindow = window.open('','','width='+w+',height='+h+',left='+x+',top='+y+',screenX='+x+',screenY='+y);
    var self = this;
    streamerID = $('#streamerID').val();
    $.ajax({
        url: 'https://api.younow.com/php/api/broadcast/info/curId=0/user=' + streamerID,
        jsonp: "callback",
        dataType: "jsonp",
        success: function (json, b, c) {
            if (json["errorCode"] > 0) {
                //streamerOnline = false;
                popupWindow.document.write("<html><body bgcolor=\"#666\"> Streamer offline</html>");
            } else {
                //streamerOnline = true;
                popupWindow.document.write(
                "<html><body bgcolor=\"#666\">" +
                "User-ID: " + json.userId + "<br />" +
                "Chat-Level: " + json.minChatLevel + "<br />" +
                "Age: " + json.age + "<br />" +
                "Max Likes: " + json.maxLikesInBroadcast + "<br />" +
                "Fans: " + json.totalFans + "<br />" +
                "Partner: " + json.partner + "<br />" +
                "Broadcast-Info: " + "<br />" + json.broadcasterInfo + "<br />" +
                "Stream-URL: " + "<br />" + "rtmp://" + json.media.host + json.media.app + "/" + json.media.stream + "<br />" + 
                "<html>"
                );
            }
        }
    });
    
}
