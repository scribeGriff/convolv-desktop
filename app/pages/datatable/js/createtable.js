/* global DataTable: false */
/* jshint node: true, browser: true, esnext: true */

(function () {
  "use strict";

  var tableDiv, dataKey, importedData, tableID, datatable, 
      pageNum, lastPageNum, keyString, termString, termName;

  var updatePageNumber, buildHtmlTable, addAllColumnHeaders;

  var _table_ = document.createElement('table'),
      _tr_ = document.createElement('tr'),
      _th_ = document.createElement('th'),
      _td_ = document.createElement('td'),
      _tbody_ = document.createElement('tbody');

  window.onload = function() {
    require('electron').ipcRenderer.on('ping', (event, message) => {
      dataKey = message.split("_")[0];
      termName = message.split("_")[1];
      tableDiv = document.getElementById("tablediv");
      pageNum = document.getElementById("pagenumber");
      importedData = JSON.parse(localStorage.getItem(message));
      console.log(importedData);
      if (importedData !== null) {
        tableDiv.appendChild(buildHtmlTable(importedData));
        tableID = document.getElementById("datatable");
        datatable = new DataTable(tableID, {
          pageSize: 20,
          sort: '*'
        });
        keyString = dataKey.charAt(1).toUpperCase() + dataKey.slice(2);
        termString = termName.charAt(0).toUpperCase() + termName.slice(1,-1) + ' ' + termName.charAt(termName.length - 1);
        document.title = "Raw Data for " + keyString + " at " + termString;
        document.getElementById("title").innerHTML = keyString + " (" + termString + ")";
        window.addEventListener('click', updatePageNumber, false);
        lastPageNum = datatable.getLastPageNumber();
        pageNum.innerHTML = "page " + datatable.getCurrentPage() + " of " + lastPageNum;
      }
    });
  };

  updatePageNumber = function updatePageNumber() {
    pageNum.innerHTML = "page " + datatable.getCurrentPage() + " of " + lastPageNum;
  };

  // Builds the HTML Table out of myList json data from Ivy restful service.
  buildHtmlTable = function buildHtmlTable(arr) {
    var cellValue, tr, td;
    var table = _table_.cloneNode(false),
        tbody = _tbody_.cloneNode(false),
        columns = addAllColumnHeaders(arr, table);
    for (var i=0, maxi=arr.length; i < maxi; ++i) {
      tr = _tr_.cloneNode(false);
      for (var j=0, maxj=columns.length; j < maxj ; ++j) {
        td = _td_.cloneNode(false);
        cellValue = arr[i][columns[j]];
        td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    table.id = "datatable";
    table.classList.add("table", "is-bordered", "is-striped", "is-narrow");
    return table;
  };

  // Adds a header row to the table and returns the set of columns.
  // Need to do union of keys from all records as some records may not contain
  // all records
  addAllColumnHeaders = function addAllColumnHeaders(arr, table) {
    var columnSet = [], th,
        tr = _tr_.cloneNode(false),
        header = table.createTHead();
    for (var i=0, l=arr.length; i < l; i++) {
      for (var key in arr[i]) {
        if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key)===-1) {
          columnSet.push(key);
          th = _th_.cloneNode(false);
          th.appendChild(document.createTextNode(key));
          tr.appendChild(th);
        }
      }
    }
    header.appendChild(tr);
    return columnSet;
  };
}());