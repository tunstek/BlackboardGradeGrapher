var thisData = null;
var thisLabels = null;
var thisSubject = null;
var canvasCreated = false;

var thisLabsLabel = null;

var CHART;
var lineChart;
var chartType = null;
var thisChartType;
var dataVals, dataArr,labelVals, labelArr ,subjVals, subject, labsVal;
var toggleLabel = 0;

Chart.defaults.scale.ticks.beginAtZero = true;
Chart.defaults.scale.ticks.max = 100;
Chart.defaults.global.animation.duration = 2000;
Chart.defaults.global.defaultFontColor = "#000";
//Chart.defaults.global.maintainAspectRatio = false;
//Chart.defaults.global.responsive = true;
Chart.defaults.global.legend.position = 'bottom';



function graphThis(type){

  lineChart = new Chart (CHART, {


    type: type,
    data: data = {
      axisY: {
    title: "percentage"
  },
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

    tooltips : {
        enabled: true,
        tooltipTemplate: "<%if (labels){%><%=labels%>: <%}%><%= value %>"
    },

    scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Percentage%'
          }
        }]
      },
    maintainAspectRatio: true,
    bezierCurve: false,

//when animation is completed
      animation:{
          onComplete : function(){
            var ctx = this.chart.ctx;
            var chartInstance = this.chart;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillStyle = "#000";

             var x_offset=0;
             var y_offset=10;
            // if(chartType == 'bar'){
            //   x_offset = 10;
            //   y_offset = 5;
            // }

            //
            // if(chartType == 'line'){
            //   x_offset = 10;
            //   y_offset = 10;
            // }
            ctx.textAlign = "center";
//display percentage of each point on the graph
            this.data.datasets.forEach(function (dataset, i) {
                          var meta = chartInstance.controller.getDatasetMeta(i);
                          meta.data.forEach(function (bar, index) {
                              var data = dataset.data[index];
                              ctx.fillText(data, bar._model.x + x_offset, bar._model.y +y_offset);
                          });
                      });

//convert canvas object to a a png image
            var url_base64 = document.getElementById("lineChart").toDataURL("image/png");
            link1.href = url_base64;
            var url = link1.href.replace(/^data:image\/[^;]/, 'data:application/octet-stream');

          }
      }

  }

  });


}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){

//extract the messages passed from getPageSource.JS
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

      if(message.type == "labsLabel"){
        thisLabsLabel = message;

      }


//check if all the necessary messages are passed to graph the grades.
if(thisData != null & thisLabels != null & thisSubject !=null & thisChartType !=null & thisLabsLabel!=null){


//check if canvas has been created already.
if(canvasCreated == false){
CHART = document.getElementById("lineChart");
console.log(CHART);
canvasCreated = true;
}
//if already created, have to clear the old one and draw a new graph on same canvas
else {
lineChart.destroy();
CHART = document.getElementById("lineChart");
}


//get the values from the objects passed as a message from getPageSource.js
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

var labsObject = Object.values(thisLabsLabel);
labsVal = labsObject[0];

 graphThis(chartType);

//make all the messages passed from getPageSource to null so they dont corrupt the next messages passed.
thisData = null;
thisLabels= null;
thisSubject = null;
thisChartType = null;
thisLabsLabel = null;
console.log("graphed!");
}

});




//functionto change from line graph to a bar chart
$('#barChartIt').click(function do_something(){

  lineChart.destroy();
  CHART = document.getElementById("lineChart");
  document.getElementById("barChartIt").disabled = true;
  graphThis('bar');
  document.getElementById("lineChartIt").disabled = false;

});


//function to change bar graph to line graph
$('#lineChartIt').click(function do_something(){
  console.log("line it");
  lineChart.destroy();
  CHART = document.getElementById("lineChart");
  document.getElementById("lineChartIt").disabled = true;
  graphThis('line');
  document.getElementById("barChartIt").disabled= false;

});



//function to change y axis/label
$('#change_Labels').click(function change_Labels(){

  //check current state
  if(toggleLabel ==0 ){
    lineChart.config.data.labels = labsVal;
    toggleLabel = 1;
  }
  else{
    lineChart.config.data.labels = labelArr;
    toggleLabel = 0;
  }


  lineChart.update()

});
