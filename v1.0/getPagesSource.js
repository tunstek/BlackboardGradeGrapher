/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 */

function DOMtoString(document_root) {
    var html = '',
        node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            html += node.outerHTML;
            break;
        case Node.TEXT_NODE:
            html += node.nodeValue;
            break;
        case Node.CDATA_SECTION_NODE:
            html += '<![CDATA[' + node.nodeValue + ']]>';
            break;
        case Node.COMMENT_NODE:
            html += '<!--' + node.nodeValue + '-->';
            break;
        case Node.DOCUMENT_TYPE_NODE:
            // (X)HTML documents are identified by public identifiers
            html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
        }
        node = node.nextSibling;
    }


    //Get the content of the nested iframes
    var iframe = document.querySelector('#mybbCanvas');
    var iframe1Document = iframe.contentDocument;
    var iframe2 = iframe1Document.querySelector('#right_stream_mygrades');
    var iframe2Document = iframe2.contentDocument;

    var elements = $(iframe2Document);

    var header = $('#streamDetailHeaderRight', elements);
    var title = header.find('.context').text();
    //only take what in brackets
    var ind1 = title.indexOf('(');
    var ind2 = title.indexOf(')');
    if(ind1 != -1 && ind2 != -1 && ind1 < ind2) {
      //The title contains brackets
      title = title.substr(ind1+1, ind2-ind1-1); //not including the brackets themselves
    }

    //console.log(title.text());

    var gradesWrapper = $('#grades_wrapper', elements);


    //Check for 'Total' row
    var totalIsPresent = false;
    var totalDiv = gradesWrapper.find("div[rowindex=2]");
    var totalStr = totalDiv.find('.cell.gradable').text().trim();
    if(totalStr == "Total") {
      totalIsPresent = true;
    }

    //Get the overall grade (This will be displayed alongside the graph)
    if(totalIsPresent) {
      var overallGrade = gradesWrapper.find("div[rowindex=2]");
      var ovGrade = overallGrade.find('.grade[tabindex=0]');
      var ovOutOf = overallGrade.find('.pointsPossible.clearfloats'); //This has a leading '/'

      var ovGradeStr = $(ovGrade).text();
      var ovOutOfStrS = $(ovOutOf).text();
      var ovOutOfStr = ovOutOfStrS.substr(1); //remove '/'
      var ovGradeFl = parseFloat(ovGradeStr);
      var ovOutOfFl = parseFloat(ovOutOfStr);
      var ovPercent = (ovGradeFl/ovOutOfFl) * 100;
      var ovPercentR =  Math.round(ovPercent * 100) / 100; //Limit to 2 decimal places

      console.log("Overall: " + ovGradeFl + "/" + ovOutOfFl + " =" + ovPercentR + "%");

      //Add the total percentage to the title
    //  title = title + " Overall:" + ovPercentR + "%";
    }
    else {
      console.log("Total not present.");
    }

    var subject = title;
    var index = 0;
    var objs = [];
    //Loop through each singular result
    $(gradesWrapper.find('.sortable_item_row.graded_item_row.row.expanded')).each(function() {
      //console.log("index:" + $(this).attr("rowindex"));

      //For each grade

      var gradeTitle = "";

      //The grade title can be contained in the immediate div or inside the div in an <a>
      var gradeTitleTO = $(this).find(".cell.gradable");
      var gradeTitleTOStr = $(gradeTitleTO).contents().get(0).nodeValue.trim();
      var gradeTitleA = $(this).find("a[href='#']").text().trim();
      if(gradeTitleTOStr != "") {
        gradeTitle = gradeTitleTOStr;
      }
      else if(gradeTitleA != "") {
        gradeTitle = gradeTitleA;
      }
      console.log(gradeTitle);

      //get the status of the current grade
      var status = $(this).find('span.activityType').text();
      if(status == "Graded") {
        //Only take results that have been graded

        //Truncate a long assignment title
        var label = gradeTitle.substr(0, 11);
        if(label != gradeTitle) {
          label  = label + "..";
        }


        var date = $(this).find('.lastActivityDate').text();
        var dateStr = date.substr(0, 11);
        var grade = $(this).find('.grade[tabindex=0]');
        var outOf = $(this).find('.pointsPossible.clearfloats'); //This has a leading '/'

        var grade = parseFloat($(grade).text());
        var outOfStr = $(outOf).text();
        var outOf = parseFloat(outOfStr.substr(1)); //remove '/'
        var percent = (grade/outOf) * 100;
        //Check if % is > 100  --> Assignment may be worth extra marks
        if(percent > 100) {
          percent = 100;
        }
        percent = percent.toFixed(0);

        //Check for any errors
        if(isNaN(grade)) {
          console.log("No grade available");
        }
        else if(isNaN(percent)) {
          console.log("An error occured calculating the percentage. grade=" + grade + " outOf=" + outOf);
        }
        else {
          console.log(grade + "/" + outOf + " = " + percent + "%");
        }

        console.log("Graded on: " + dateStr);

        var gradeObj = {date:dateStr, percentage:percent, label:label};
        objs[index] = gradeObj;

        index++;
      }
      else {
        console.log("Not graded");
      }



    });

    //Sort the percentages, labels and dates arrays by date
    objs.sort(function(a, b) {
      return Date.parse(a.date) - Date.parse(b.date);
    });

    //console.log(objs);

    console.log(iframe2Document);


    //Create each array from the objs array
    var dates = objs.map(function(a) {return a.date;});
    var percentages = objs.map(function(a) {return a.percentage;});
    var labels = objs.map(function(a) {return a.label;});


    var chartType = 'line';
    //console.log(percentages.length);
    if(percentages.length == 1){
      chartType = 'bar';
    }
    console.log(chartType);

    chrome.runtime.sendMessage({content: percentages, type: "data"});
    chrome.runtime.sendMessage({content: dates, type: "label"});
    chrome.runtime.sendMessage({content: labels, type: "labsLabel"});

    chrome.runtime.sendMessage({content: subject, type: "subject"});
    chrome.runtime.sendMessage({content: chartType, type: "chartType"})


}

chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
