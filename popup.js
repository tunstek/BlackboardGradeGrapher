


document.addEventListener('DOMContentLoaded', function() {

    var message = document.querySelector('#message');

    chrome.tabs.executeScript(null, { file: "jquery.js" }, function() {
      chrome.tabs.executeScript(null, { file: "getPagesSource.js" }, function() {
      });
    });


  }, false);
