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
    postEvent('Connected to server.', 'success');
    socket.emit('accountid', socket.accountid);
  }).on('disconnect', function () {
    postEvent('Disconnected from server.', 'danger');
  }).on('inbound', function (message) {
    addInboundMessage(message);
  }).on('delivered', function (message) {
    addDeliveredMessage(message);
  }).on('failure', function (message) {
    addFailureMessage(message);
  }).on('accountid', function (accountId) {
    postEvent('AccountID set to ' + accountId);
  });



  function postEvent(message, style) {
    style = style || 'info';
    $('#client-events').prepend($('<pre>').addClass('btn-' + style).text(message));
  }

  function addMessageRow(panelclass, glyphicon, message) {
    var $html = $('<div class="panel">\
  <div class="panel-heading">\
    <a class="message-summary collapsed text" data-toggle="collapse" data-parent="#messages" href="#">\
      <span class="glyphicon glyph"></span>\
      <span class="message-id"></span>\
      <span class="message-body"></span>\
    </a>\
  </div>\
  <div class="message-panel panel-collapse collapse" style="height: 0px;">\
    <div class="panel-body">\
      <pre class="message-data"></pre>\
    </div>\
  </div>\
</div>');

    var id = new Date().getTime() + message.MessageId[0];

    $html.find('a').attr('href', '#' + id);
    $html.find('.message-panel').attr('id', id);
    $html.find('.glyphicon').addClass(glyphicon);
    $html.find('.message-id').text(message.MessageId);
    if (message.MessageText) $html.find('.message-body').text(message.MessageText);
    $html.find('.message-data').html(syntaxHighlight(message));
    $html.addClass(panelclass);

    $('#messages').prepend($html);
  }

  function addInboundMessage(message) {
    addMessageRow('panel-success', 'glyphicon-resize-small', message.push);
  }

  function addDeliveredMessage(message) {
    addMessageRow('panel-info', 'glyphicon-resize-full', message.push);
  }

  function addFailureMessage(message) {
    addMessageRow('panel-danger', 'glyphicon-remove', message.push);
  }


  var guidRegex = /^[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}$/i;

  $('#setAccountId').click(function (event) {
    event.preventDefault();
    var accountId = $('#accountid').val();

    if (!guidRegex.test(accountId))
      return;
    
    socket.accountid = accountId;
    socket.emit('accountid', accountId);

    return false;
  });

  $('#accountid').blur(function () {
    var textbox = $('#accountid');
    var text = textbox.val();

    if (text.length > 0 && !guidRegex.test(text))
      return textbox.addClass('bad');
    textbox.removeClass('bad');
  });

  $('#clear-statuses').click(function (event) {
    event.preventDefault();
    $('#client-events').empty();
  });

  $('#clear-messages').click(function (event) {
    event.preventDefault();
    $('#messages').empty();
  });

});