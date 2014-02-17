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

	var listener = null;
	var guidRegex = /^[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}$/i;

	function writeEventText(text) {
		$('#events').prepend($("<pre>").text(text));
	}

	function writeEventHTML(html) {
		$('#events').prepend($("<pre>").html(html));
	}

	$("#setAccountId").click(function (event) {

		event.preventDefault();

		if (listener != null) {
			writeEventText("Closing current connection ('" + listener.URL + "')...");
			listener.close();
			listener = null;
		}

		var accountId = $("#accountid").val();

		if (!guidRegex.test(accountId)) {
			writeEventText("The ID '" + accountId + "' does not look like an account ID.");
		} else {
			listener = new EventSource("/listen/" + accountId);
			writeEventText("Opening connection to: '" + listener.URL + "'...");

			listener.onerror = function (e) {
				writeEventText("Error while listening, readyState: " + listener.readyState);
			};
			listener.onmessage = function(message) {
				var json = $.parseJSON(message.data);

				if (json.event == "connect") {
					writeEventText("Server 'connect' message with account ID: " + json.accountId);
				} else {
					var sanitized = JSON.stringify(json, undefined, 2);
					writeEventHTML(syntaxHighlight(sanitized));
				}
			};
		}
		return false;
	});

	$("#clear").click(function (event) {
		event.preventDefault();

		$('#events').empty();
	});
});