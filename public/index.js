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
    writeEventText("Connected to server.");
    socket.emit('accountid', socket.accountid);
  });
  socket.on('disconnect', function () {
    writeEventText("Disconnected from server.");
  });

  socket.on('inbound', function (data) {
    postEvent('inbound', data);
    //writeEventHTML(syntaxHighlight(data));
  });
  socket.on('delivered', function (data) {
    postEvent('delivered', data);
    //writeEventHTML(syntaxHighlight(data));
  });
  socket.on('failure', function (data) {
    postEvent('failure', data);
    //writeEventHTML(syntaxHighlight(data));
  });

  socket.on('accountid', function (data) {
    writeEventHTML('AccountID set to ' + data);
  });


  var guidRegex = /^[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}$/i;

  function writeEventText(text) {
    $('#events').prepend($("<pre>").text(text));
  }

  function writeEventHTML(html) {
    $('#events').prepend($("<pre>").html(html));
  }

  function postEvent(type, e) {
    var li = $('<li>');
    li.addClass(type);
    li.append($('<span>').text(e.push.Id));
    li.append($('<br>'));
    if (e.push.MessageText)
      li.append($('<span>').text(e.push.MessageText));

    $('#events').prepend(li);
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

    $('#events').empty();
  });
});