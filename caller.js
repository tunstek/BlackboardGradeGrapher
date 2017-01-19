
var chartType;




var labels = ["Assg1","Assg2","Assg3","Assg4","Assg5","Assg6","Assg7","Assg8" ];
var data = [50, 20, 40, 45, 50, 55, 70, 91];
var subject = "Maths"
chartType = 'line';
chrome.runtime.sendMessage({content: data, type: "data"});
chrome.runtime.sendMessage({content: labels, type: "label"});
chrome.runtime.sendMessage({content: subject, type: "subject"});
chrome.runtime.sendMessage({content: chartType, type: "chartType"})




setTimeout(function(){

      var label2 = ["lab1","lab2"];
      var data2 = [60.5,70.5];
      var subj2 = "Algorithms";
      chartType = 'bar';

      chrome.runtime.sendMessage({content: data2, type: "data"});
      chrome.runtime.sendMessage({content: label2, type: "label"});
      chrome.runtime.sendMessage({content: subj2, type: "subject"});
      chrome.runtime.sendMessage({content: chartType, type: "chartType"})


}, 4000);



setTimeout(function(){

      var label3 = ["paper1","paper2","paper3","paper4"];
      var data3 = [60.5,70.5,90.23,87];
      var subj3 = "Philosophy";
      chartType = 'line';

      chrome.runtime.sendMessage({content: data3, type: "data"});
      chrome.runtime.sendMessage({content: label3, type: "label"});
      chrome.runtime.sendMessage({content: subj3, type: "subject"});
      chrome.runtime.sendMessage({content: chartType, type: "chartType"})


}, 7000);
