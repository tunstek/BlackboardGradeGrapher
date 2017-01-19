


document.addEventListener('DOMContentLoaded', function() {

    var message = document.querySelector('#message');

    //alert(window.document.location.href);
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      var url = tabs[0].url;
      if(url.indexOf("https://tcd.blackboard.com/webapps/bb-social-learning-BBLEARN/execute/mybb?cmd=display&toolId=MyGradesOnMyBb_____MyGradesTool&extraParams=override_stream=mygrades") != -1) {
      //if(url.indexOf("blackboard.com/webapps/") != -1) {
        //We are on the blackboard website
        chrome.tabs.executeScript(null, { file: "jquery.js" }, function() {
          chrome.tabs.executeScript(null, { file: "getPagesSource.js" }, function() {
          });
        });
      }
      else {
        //We are not on the Blackboard website
        //Redirect:
        chrome.tabs.create({url: "https://tcd.blackboard.com/webapps/bb-social-learning-BBLEARN/execute/mybb?cmd=display&toolId=MyGradesOnMyBb_____MyGradesTool&extraParams=override_stream=mygrades","selected":true}, function(tab){
          makeRequest(tab.id);
        });

      }
    });




  }, false);
