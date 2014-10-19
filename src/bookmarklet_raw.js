(function(global, gistId, fileName) {
  var callbackCounter = 0,
      callbackGlobalId = 'JSONP_' + Math.random().toString(36).replace(/\./, '');

  // Global callbacks dictionary
  global[callbackGlobalId] = {};

  function sendJSONPRequest(url, callback) {
    var script = document.createElement('script'),
        done = false,
        callbackName = 'callback' + callbackCounter++,
        head;

    url = url + "?callback=" + callbackGlobalId + "." + callbackName;
    global[callbackGlobalId][callbackName] = callback;

    script.src = url;
    script.async = true;

    script.onload = script.onreadystatechange = function() {
      if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
        done = true;
        script.onload = script.onreadystatechange = null;
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }
    };

    if (!head) {
      head = document.getElementsByTagName('head')[0];
    }
    head.appendChild(script);
  }

  function getRawGistUrl(gistId, fileName, callback) {
    sendJSONPRequest('https://api.github.com/gists/' + gistId, function(response) {
      var files = response.data.files,
          file = fileName ? files[fileName] : null,
          gistUrl;

      // take first file if none defined
      if (!file) {
        for (var key in files) {
          if (files.hasOwnProperty(key)) {
            file = files[key];
            break;
          }
        }
      }

      // Use rawgit.com to serve gists
      gistUrl = file.raw_url.replace('gist.githubusercontent.com', 'cdn.rawgit.com');
      callback(gistUrl);
    });
  }

  // gist.githubusercontent.com
  getRawGistUrl(gistId, fileName, function(rawGistUrl) {
    var script = document.createElement('script');

    script.src = rawGistUrl + '?t=' + (new Date()).getTime();
    document.getElementsByTagName('head')[0].appendChild(script);
  });

})(window, '__GISTID__', '__FILENAME__');
