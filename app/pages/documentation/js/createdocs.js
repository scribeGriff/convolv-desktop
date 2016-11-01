/* global DataTable: false, smoothScroll: false, renderMathInElement: false */
/* jshint node: true, browser: true, esnext: true */
(function () {
  "use strict";

  var tableDiv, dataKey, importedData, tableID, datatable,
      helpNameDiv, helpDescDiv, helpSyntDiv, helpExamDiv, helpSeeaDiv, helpTypeDiv;

  var buildHtmlTable, addAllColumnHeaders, entrySelect;

  var _table_ = document.createElement('table'),
      _tr_ = document.createElement('tr'),
      _th_ = document.createElement('th'),
      _td_ = document.createElement('td'),
      _tbody_ = document.createElement('tbody');

  window.onload = function() {
    smoothScroll.init();
    tableDiv = document.getElementById("documentdiv");
    helpNameDiv = document.getElementById("Name");
    helpDescDiv = document.getElementById("Description");
    helpSyntDiv = document.getElementById("Syntax");
    helpExamDiv = document.getElementById("Example");
    helpSeeaDiv = document.getElementById("Seealso");
    helpTypeDiv = document.getElementById("Type");
    // Import the external help files.
    importedData = require("../../data/help.json");

    if (importedData !== null) {
      tableDiv.appendChild(buildHtmlTable(importedData));
      tableID = document.getElementById("datatable");
      try {
        datatable = new DataTable(tableID, {
          pageSize: 10000,
          sort:  [true, true],
          filters: [true, 'select'],
          filterEmptySelect: 'All',
          filterSelectOptions: true,
          filterInputClass: 'input',
          lineFormat: function (id, data) {
            var res = document.createElement('tr');
            res.dataset.id = id;
            for (var key in data) {
              if (data.hasOwnProperty(key)) {
                if (key === "0") {
                  res.innerHTML += '<td class="table-link">' + data[key] + '</td>';
                } else {
                  res.innerHTML += '<td>' + data[key] + '</td>';
                }
              }
            }
            return res;
          }
        });
      } catch (error) {
        // Continue without using extras from datatable.js.  Will 
        // still function as a standard html table.
      }

      tableDiv.addEventListener('click', entrySelect, false);
      helpNameDiv.innerHTML = importedData[0].Name;
      helpDescDiv.innerHTML = importedData[0].Description;
      helpSyntDiv.innerHTML = importedData[0].Syntax.join('<br>');
      helpExamDiv.innerHTML = importedData[0].Example.split(';').join(';<br>');
      helpSeeaDiv.innerHTML = importedData[0]["See also"].join(', ');
      helpTypeDiv.innerHTML = importedData[0].Type;

    } else {
      // Require returned a null object for json for some reason.
      tableDiv.innerHTML = '<h2 class="title is-2">Unable to locate the document file.</h2>';
    }
  };

  entrySelect = function entrySelect(element) {
    element.preventDefault();
    if (element.target.tagName.toUpperCase() === "A") {
      if (document.body.clientWidth < 768) {
        smoothScroll.animateScroll('#scrolldown');
      }
      var indexSelected = importedData.findIndex(x => x.Name == element.target.innerHTML);
      helpNameDiv.innerHTML = importedData[indexSelected].Name;
      helpDescDiv.innerHTML = importedData[indexSelected].Description;
      helpSyntDiv.innerHTML = importedData[indexSelected].Syntax.join('<br>');
      helpExamDiv.innerHTML = importedData[indexSelected].Example.split(';').join(';<br>');
      helpSeeaDiv.innerHTML = importedData[indexSelected]["See also"].join(', ');
      helpTypeDiv.innerHTML = importedData[indexSelected].Type;

      renderMathInElement(helpDescDiv);
    }
  };

  buildHtmlTable = function buildHtmlTable(arr) {
    var _helpOrder = ["Name", "Category"];
    var cellValue, tr, td, anchor, link;
    var table = _table_.cloneNode(false),
        tbody = _tbody_.cloneNode(false),
        columns = addAllColumnHeaders(_helpOrder, table);
    for (var i = 0, maxi = arr.length; i < maxi; ++i) {
      tr = _tr_.cloneNode(false);
      for (var j = 0, maxj = columns.length; j < maxj ; ++j) {
        td = _td_.cloneNode(false);
        cellValue = arr[i][columns[j]];
        if (j === 0) {
          anchor = document.createElement("A");
          link = document.createTextNode(cellValue);
          anchor.setAttribute("href", "#");
          anchor.appendChild(link);
          td.appendChild(anchor);
        } else {
          td.appendChild(document.createTextNode(cellValue || ''));
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    table.id = "datatable";
    table.classList.add("table", "is-bordered");
    return table;
  };

  // Adds a header row to the table.
  addAllColumnHeaders = function addAllColumnHeaders(arr, table) {
    var th, tr = _tr_.cloneNode(false),
        header = table.createTHead();
    for (var i = 0, l = arr.length; i < l; i++) {
      th = _th_.cloneNode(false);
      th.appendChild(document.createTextNode(arr[i]));
      tr.appendChild(th);
    }
    header.appendChild(tr);
    return arr;
  };
}());