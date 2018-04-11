var tags = $('#my-tag-list');
$(function () {
    tags = tags.tags({
        tagData: ["PNW"],
        excludeList: ["not", "these", "words"]
    });

});

var transportType = signalR.TransportType.WebSockets;
//can also be ServerSentEvents or LongPolling
var logger = new signalR.ConsoleLogger(signalR.LogLevel.Information);
var chatHub = new signalR.HttpConnection(`${document.location.origin}/netwatch`, { transport: transportType, logger: logger });
var chatConnection = new signalR.HubConnection(chatHub, logger);

chatConnection.onClosed = e => {
    console.log('connection closed');
};

chatConnection.on('Send', (message) => {
    var table = "<table class='table table- striped table-bordered table-hover dataTable no- footer'><tr><th>Start Time</th><th>Duration</th><th>Source Peer</th><th>Source Radio</th><th>Dest. Bridge</th><th>dBm</th><th>Site Name</th><th>Loss Rate</th></tr>";
    var aryTags = tags.getTags();
    if (message.length > 10) {
        var streams = message.split("|");
        for (var i = 0; i < streams.length; i++) {
            if (aryTags.length > 0) {
                if (new RegExp(aryTags.join("|")).test(streams[i])) {
                    var data = streams[i].split(",");
                    var line = "<tr>";
                    for (var lineI = 0; lineI < data.length; lineI++) {
                        line += "<td>" + data[lineI].replace(/[\x00-\x1F\x7F-\x9F]/g, " ") + "</td>"
                    }
                    table += line + "</tr>";
                }
            }
            else {
                var data = streams[i].split(",");
                var line = "<tr>";
                for (var lineI = 0; lineI < data.length; lineI++) {
                    line += "<td>" + data[lineI].replace(/[\x00-\x1F\x7F-\x9F]/g, " ") + "</td>"
                }
                table += line + "</tr>";
            }
        }
        table += "</table>"
        document.getElementById("netwatch").innerHTML = table;
    }
});

chatConnection.start().catch(err => {
    console.log('connection error');
});

function send(message) {
    chatConnection.invoke('Send', message);
}
