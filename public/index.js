$(function () {

  function syntaxHighlight(json) {
    if (typeof json != 'string') {
       json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }


  var socket = io.connect();
  socket.accountid = '00000000-0000-0000-0000-000000000000';

  socket.on('connect', function () {
    writeEventHTML("Connected to server.");
    socket.emit('accountid', socket.accountid);
  });
  socket.on('disconnect', function () {
    writeEventHTML("Disconnected from server.");
  });

  socket.on('inbound', function (data) {
    postEvent('inbound', data);
  });
  socket.on('delivered', function (data) {
    postEvent('delivered', data);
  });
  socket.on('failure', function (data) {
    postEvent('failure', data);
  });

  socket.on('accountid', function (data) {
    writeEventHTML('AccountID set to ' + data);
  });


  var guidRegex = /^[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}$/i;

  function writeEventHTML(html) {
     $('#client-events').prepend($("<pre class=\"btn-primary\">").html(html));
  }

    var hash = 2;

  function postEvent(type, raw) {
   
    var html = '<div class="panel panel-default"> \
                         <div class="panel-heading"> \
                            <a data-toggle="collapse" data-parent="#accordion" href="#'+ hash +'" class="collapsed text">##################</a> \
                </div> \
           <div id="'+ hash +'" class="panel-collapse collapse" style="height: 0px;"> \
               <div class="panel-body"> \
                   <pre>'+ syntaxHighlight(raw) +'</pre> \
               </div> \
           </div> \
       </div>';

   if (type == "inbound") {

        html = html.replace("##################", '<span class="glyphicon glyphicon-resize-small glyph"></span>' + raw.push.MessageId + ' - ' + raw.push.MessageText);
        html = html.replace("panel-default", "panel-success");
        $('#accordion').prepend($(html));       
      }

      if (type == "delivered") {

        html = html.replace("##################", '<span class="glyphicon glyphicon-resize-full glyph"></span>' + raw.push.MessageId);
        html = html.replace("panel-default", "panel-info");
        $('#accordion').prepend($(html));
      }

      if (type == "failure") {

        html = html.replace("##################", '<span class="glyphicon glyphicon-remove glyph"></span>' + raw.push.MessageId);
        html = html.replace("panel-default", "panel-danger");
        $('#accordion').prepend($(html));
      }
      
      hash++;
  }

  $("#setAccountId").click(function (event) {
    event.preventDefault();
    var accountId = $("#accountid").val();

    if (!guidRegex.test(accountId))
      return writeEventText("The specified ID is not a valid GUID: " + accountId);
    
    socket.accountid = accountId;
    socket.emit('accountid', accountId);

    return false;
  });

  $("#clear").click(function (event) {
    event.preventDefault();

    $('#client-events').empty();
    $('#accordion').empty();
  });
});