var thisData = null;
var thisLabels = null;
var thisSubject = null;
var canvasCreated = false;
var CHART;
var lineChart;
var chartType = null;
var thisChartType;
var dataVals, dataArr,labelVals, labelArr ,subjVals, subject;

Chart.defaults.scale.ticks.beginAtZero = true;
Chart.defaults.scale.ticks.max = 100;
Chart.defaults.global.animation.duration = 2000;






function graphThis(type){

  lineChart = new Chart (CHART, {
    type: type,
    data: data = {
      labels: labelArr,
      datasets: [
          {
              label: subject,
              fill: true,
              lineTension: 0.1,
              backgroundColor: "rgba(75,192,192,0.4)",

              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(0,0,0)",
              pointHoverBorderWidth: 10,
              pointRadius: 1,
              pointHitRadius: 4,
              data: dataArr,
              spanGaps: false,
          }
      ]

  },



  options:{


    maintainAspectRatio: true,

    bezierCurve: false,

      animation:{
          onComplete : function(){

            var url_base64 = document.getElementById("lineChart").toDataURL("image/png");

            link1.href = url_base64;

            var url = link1.href.replace(/^data:image\/[^;]/, 'data:application/octet-stream');

          }
      }
  }

  });




}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){



  if(message.type == "data") {
      console.log("First message: ", message.content);
      thisData = message;
    }

    if(message.type == "label") {
        console.log("Second message: ", message.content);
        thisLabels = message;
      }

      if(message.type == "subject") {
          console.log("third message: ", message.content);
          thisSubject = message;
        }

      if(message.type== "chartType"){
        thisChartType = message;
        console.log(message);
      }





if(thisData != null & thisLabels != null & thisSubject !=null & thisChartType !=null){

console.log(thisData);

if(canvasCreated == false){
CHART = document.getElementById("lineChart");
console.log(CHART);
canvasCreated = true;
}

else {
lineChart.destroy();
CHART = document.getElementById("lineChart");


}


 dataVals = Object.values(thisData);
 dataArr =dataVals[0];
console.log(dataArr);

labelVals = Object.values(thisLabels);
 labelArr = labelVals[0];
console.log(labelArr);


 subjVals = Object.values(thisSubject);
 subject = subjVals[0];

var chartTypeVals = Object.values(thisChartType);
chartType = chartTypeVals[0];




 graphThis(chartType);


thisData = null;
thisLabels= null;
thisSubject = null;
thisChartType = null;
console.log("graphed!");
}

});





$('#barChartIt').click(function do_something(){

  lineChart.destroy();
  CHART = document.getElementById("lineChart");

  //document.getElementById("barChartIt").style.visibility = 'hidden';



  document.getElementById("barChartIt").disabled = true;


  //document.getElementById("lineChartIt").style.visibility = 'visible';


  graphThis('bar');
  document.getElementById("lineChartIt").disabled = false;

});



$('#lineChartIt').click(function do_something(){

  lineChart.destroy();
  CHART = document.getElementById("lineChart");
  document.getElementById("lineChartIt").disabled = true;

  //document.getElementById("lineChartIt").style.visibility = 'hidden';
  //document.getElementById("barChartIt").style.visibility = 'visible';
  graphThis('line');
  document.getElementById("barChartIt").disabled= false;


});

$('#change_Labels').click(function change_Labels(){
  lineChart.scale.xLabels = labsLabel;
}
