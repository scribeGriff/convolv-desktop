/* The following code is based on Terminal by Sasa Djolic.
   Original Copyright (c) 2012 Sasa Djolic, SDA Software Associates Inc.
   The original license can be found here: https://github.com/SDA/terminal/blob/master/LICENSE
*/

/* global math:false, katex: false, awesomplete: false */
/* jshint node: true, browser: true, esnext: true, -W040: true, -W069: true */

(function (global, undefined) {
  "use strict";

  var Terminal = Terminal || function(containerID, uoptions) {
    if (!containerID) return;

    var defaults = {
      welcome: 'Welcome to The Math Console.<br>To get started, type help at the prompt.',
      prompt: '1 ',
      separator: '<i class="fa fa-angle-right"></i>',
      theme: 'monokai'
    };

    var options = uoptions || defaults;
    options.welcome = options.welcome || defaults.welcome;
    options.prompt = options.prompt || defaults.prompt;
    options.separator = options.separator || defaults.separator;
    options.theme = options.theme || defaults.theme;

    var matchAllBuiltIns = /\b^help\b.*|\b^clear\b.*|\b^theme\b.*|\b^precision\b.*|\b^ver\b.*|\b^version\b.*|\b^line\b.*|\b^linepts\b.*|\b^area\b.*|\b^bar\b.*|\b^column\b.*|\b^curve\b.*|\b^curvepts\b.*|\b^sample\b.*|\b^samplen\b.*|\b^pie\b.*|\b^polar\b.*|\b^scatter\b.*|\b^linlog\b.*|\b^loglin\b.*|\b^loglog\b.*|\b^linlogpts\b.*|\b^loglinpts\b.*|\b^loglogpts\b.*|\b^vars\b.*|\b^loadvars\b.*|\b^savevars\b.*|\b^exportfile\b.*|\b^importfile\b.*|\b^importurl\b.*|\b^importlog\b.*|\b^datatable\b.*|\b^docs\b.*|\b^credits\b.*$/;
    var matchChartTextCmds = /\b^xaxis\b.*|\b^yaxis\b.*|\b^title\b.*|\b^subtitle\b.*|\b^series\b.*$/i;
    var matchSupportCmds = /\b^getdata\b.*|\b^outy\b.*|\b^outn\b.*|\b^outq\b.*|\b^outqn\b.*|\b^outr\b.*|\b^outrn\b.*|\b^outz\b.*|\b^length\b.*|\b^addseqs\b.*|\b^subseqs\b.*$/;

    var extensions = Array.prototype.slice.call(arguments, 2);
    
    var _historyID = 'history-' + containerID;

    var _history = localStorage[_historyID] ? JSON.parse(localStorage[_historyID]) : [];
    var _histpos = _history.length;
    var _histtemp = '';

    // Awesomplete uses this id attached to an input field.
    var _autocomp = 'autocomp-' + containerID;

    var _backgroundID = 'background-' + containerID;
    var _chartID = 'chart-' + containerID;

    // Detect when autocomplete menu is open to prevent terminal behavior on Enter key.
    var _acIsOpen = false;
    // Declare a chart as empty.
    var _chart = null;
    var _chartDashboard = null;
    // For terminal to detect if command completion should be above or below input.
    var _awesompleteDivUl = null;
    // Creates a new math parser for this terminal's scope.
    var _parser = new math.parser();
    // Initialize log information for importing data.
    var _logInfo = '<i class="prefix fa fa-angle-double-right"></i> <span class="answer">There is no data currently imported to this terminal for this session.</span>';

    // Create terminal and cache DOM nodes;
    var _terminal = document.getElementById(containerID);
    _terminal.classList.add('terminal');
    _terminal.classList.add('terminal-' + options.theme);
    _terminal.insertAdjacentHTML('beforeEnd', [
      '<div class="container">',
      '<output></output>',
      '<table class="input-line">',
      '<tr><td nowrap><div class="prompt">' + options.prompt + options.separator + '</div></td><td width="100%"><input class="cmdline" autofocus /></td></tr>',
      '</table>',
      '</div>'].join(''));
    _terminal.querySelector('.cmdline').id = _autocomp;
    var _mathterm = document.getElementById(_backgroundID);
    _mathterm.classList.add('terminal-' + options.theme + '-background');
    var _chartcont = document.getElementById(_chartID);
    _chartcont.classList.add('chart-' + options.theme);
    var _container = _terminal.querySelector('.container');
    var _inputLine = _container.querySelector('.input-line');
    var _cmdLine = _container.querySelector('.input-line .cmdline');
    var _output = _container.querySelector('output');
    var _prompt = _container.querySelector('.prompt');

    if (options.welcome) {
      output(options.welcome);
    }

    _terminal.addEventListener('awesomplete-open', function(e) {
      _acIsOpen = true;
    }, false);

    _terminal.addEventListener('awesomplete-close', function(e) {
      _acIsOpen = false;
    }, false);

    //window.addEventListener('click', function(e) {
    _terminal.addEventListener('click', function(e) {
      _cmdLine.focus();
    }, false);

    _output.addEventListener('click', function(e) {
      e.stopPropagation();
    }, false);

    // Always force text cursor to end of input line.
    _cmdLine.addEventListener('click', inputTextClick, false);
    _inputLine.addEventListener('click', function(e) {
      _cmdLine.focus();
    }, false);

    // Handle up/down key presses for shell history and enter for new command.
    _cmdLine.addEventListener('keyup', historyHandler, false);
    _cmdLine.addEventListener('keydown', processNewCommand, false);

    //window.addEventListener('keyup', function(e) {
    _terminal.addEventListener('keyup', function(e) {
      _cmdLine.focus();
      e.stopPropagation();
      e.preventDefault();
    }, false);

    function inputTextClick(e) {
      this.value = this.value;
    }

    function historyHandler(e) {
      // Clear command-line on Escape key.
      if (e.keyCode == 27) {
        this.value = '';
        e.stopPropagation();
        e.preventDefault();
      }

      if (_history.length && (e.keyCode == 38 || e.keyCode == 40)) {
        if (_history[_histpos]) {
          _history[_histpos] = this.value;
        }
        else {
          _histtemp = this.value;
        }

        if (e.keyCode == 38 && !_acIsOpen) {
          // Up arrow key.
          _histpos--;
          if (_histpos < 0) {
            _histpos = 0;
          }
        }
        else if (e.keyCode == 40 && !_acIsOpen) {
          // Down arrow key.
          _histpos++;
          if (_histpos > _history.length) {
            _histpos = _history.length;
          }
        }

        this.value = _history[_histpos] ? _history[_histpos] : _histtemp;

        // Move cursor to end of input.
        this.value = this.value;
      }
    }

    function processNewCommand(e) {
      // Only handle the Enter key.
      if (e.keyCode != 13) return;

      // If autocomplete list is open, let awesomplete
      // handle Enter key.
      if (awesomplete && _acIsOpen) return;

      var cmd, args, line, input, acdiv;
      var cmdline = this.value;

      // Save shell history.
      if (cmdline) {
        _history[_history.length] = cmdline;
        localStorage[_historyID] = JSON.stringify(_history);
        _histpos = _history.length;
      }

      // Duplicate current input and append to output section.
      if(awesomplete) {
        line = this.parentNode.parentNode.parentNode.parentNode.parentNode.cloneNode(true);
      } else {
        line = this.parentNode.parentNode.parentNode.parentNode.cloneNode(true);
      }

      line.removeAttribute('id');
      line.classList.add('line');

      input = line.querySelector('input.cmdline');
      if (input.value === '') return;
      input.autofocus = false;
      input.readOnly = true;

      // Check if a valid built-in command name or not a number.  
      // If not, try to format as tex and render with KaTeX.
      // With awesomplete, we now have an extra layer of heirarchy with the added div.
      // TODO: Need to make sure this works in all scenarios.  What about for multiple terminals?
      try {
        input.value = cleanUpInput(input.value);
        try {
          if (math.typeof(math.eval(input.value)) == 'number') {
            // try to render the math expression with katex.
            try {
              var rendstr = katex.renderToString(math.parse(input.value).toTex());
              if (awesomplete) {
                input.parentNode.insertAdjacentHTML('beforebegin', rendstr);
              } else {
                input.insertAdjacentHTML('beforebegin', rendstr);
              }
              // If Tex expression didn't work, see if katex can parse the string itself.
              // This part is a kluge since KaTex doesn't have full support of TeX yet.
            } catch(error) {
              try {
                if (awesomplete) {
                  input.parentNode.insertAdjacentHTML('beforebegin', katex.renderToString(input.value));
                } else {
                  input.insertAdjacentHTML('beforebegin', katex.renderToString(input.value));
                }
                // This seems to be some math expression that can't be handled by katex and/or mathjs.
              } catch(error) {
                if (awesomplete) {
                  input.parentNode.insertAdjacentHTML('beforebegin', input.value);
                } else {
                  input.insertAdjacentHTML('beforebegin', input.value);
                }
              }
            }
            // _parser was successful but typeof returned something other than number.
          } else {
            if (awesomplete) {
              input.parentNode.insertAdjacentHTML('beforebegin', input.value);
            } else {
              input.insertAdjacentHTML('beforebegin', input.value);
            }
          }
          // _parser was not successful so the sting is something the parser doesn't understand.
        } catch(error) {
          if (awesomplete) {
            input.parentNode.insertAdjacentHTML('beforebegin', input.value);
          } else {
            input.insertAdjacentHTML('beforebegin', input.value);
          }
        }
      } catch(error) {
        if (awesomplete) {
          input.parentNode.insertAdjacentHTML('beforebegin', input.value + ': ' + error.code);
        } else {
          input.insertAdjacentHTML('beforebegin', input.value + ': ' + error.code);
        }
      }

      // With awesomplete, need to get rid of the added div that wraps the input tag.
      if (awesomplete) {
        acdiv = line.querySelector('.awesomplete');
        acdiv.parentNode.removeChild(acdiv);
      } else {
        input.parentNode.removeChild(input);
      }
      _output.appendChild(line);

      // Hide command line until we're done processing input.
      _inputLine.classList.add('hidden');

      // Clear/setup line for next input.
      this.value = '';

      // Parse out command, args, and trim off whitespace.
      if (cmdline && cmdline.trim()) {
        // Clean up the input to remove some command mistypings and get rid
        // of spaces that could confuse the match regex.
        cmdline = cleanUpInput(cmdline);
        if (cmdline.match(matchChartTextCmds) || cmdline.match(matchAllBuiltIns)) {
          // Split command line on spaces not within double quotes.
          args = cmdline.match(/(?:[^\s"]+|"[^"]*")+/g);
          cmd = args[0];
          // Remove cmd from arg list, parse if necessary to remove quoted strings that are
          // already quoted from the command line.
          args = args.splice(1).map(function (elem) {
            try {
              return JSON.parse(elem);
            } catch (error) {
              return elem;
            }
          });
          // Otherwise, just pass the entire command line as the command.
        } else {
          cmd = cmdline;
        }
      }

      if (cmd) {
        var response = false;
        for (var index in extensions) {
          var ext = extensions[index];
          if (ext.execute) response = ext.execute(cmd, args);
          if (response !== false) break;
        }
        if (response === false) {
          response = '<i class="prefix fa fa-angle-double-right"></i> </span><span class="cmderror">' + cmd + ': This variable or command is not recognized.  Please check for spelling or syntax errors.  Hint: Variable names cannot begin with a number.</span>';
        }
        output(response);
      }

      // Show the command line.
      _inputLine.classList.remove('hidden');
      
      _terminal.scrollTop = _terminal.scrollHeight;
    }

    // Clean up str by substituting double quotes for single, 
    // replace escaped apostrophes and remove problematic
    // spaces caused by mistyping in the console.
    function cleanUpInput(str) {
      return str
        .replace(/(')((?:\\\1|.)+?)\1/g, '"$2"')
        .replace(/\\'/g, "'")
        .replace(/([\s,]+,[\s,]+)(?=(?:[^"]|"[^"]*")*$)/g, ',')
        .replace(/(\[[\s,]+)(?=(?:[^"]|"[^"]*")*$)/g, '[')
        .replace(/([\s,]+\])(?=(?:[^"]|"[^"]*")*$)/g, ']')
        .replace(/(\([\s,]+)(?=(?:[^"]|"[^"]*")*$)/g, '(')
        .replace(/([\s,]+\))(?=(?:[^"]|"[^"]*")*$)/g, ')');
    }

    function clear() {
      _output.innerHTML = '';
      _cmdLine.value = '';
      if (_awesompleteDivUl !== null) {
        _awesompleteDivUl.classList.remove('bottom50');
      }
    }

    function output(html) {
      _output.insertAdjacentHTML('beforeEnd', html);
      
      _terminal.scrollTop = _terminal.scrollHeight;

      if (_awesompleteDivUl !== null) {
        if (_container.clientHeight < _terminal.clientHeight / 2) {
          _awesompleteDivUl.classList.remove('bottom50');
        } else {
          _awesompleteDivUl.classList.add('bottom50');
        }
      }
    }

    return {
      clear: clear,
      setPrompt: function setPrompt(prompt) { 
        _prompt.innerHTML = prompt + options.separator; 
      },
      getPrompt: function getPrompt() { 
        return _prompt.innerHTML.replace(new RegExp(options.separator + '$'), ''); 
      },
      setTheme: function setTheme(theme) {
        _terminal.classList.remove('terminal-' + options.theme);
        _mathterm.classList.remove('terminal-' + options.theme + '-background');
        _chartcont.classList.remove('chart-' + options.theme);
        options.theme = theme; 
        _terminal.classList.add('terminal-' + options.theme);
        _mathterm.classList.add('terminal-' + options.theme + '-background');
        _chartcont.classList.add('chart-' + options.theme);
      },
      getTheme: function getTheme() {
        return options.theme; 
      },
      setChart: function setChart(chart) {
        _chart = chart;
      },
      getChart: function getChart() {
        return _chart;
      },
      setChartDashboard: function setChartDashboard(chart) {
        _chartDashboard = chart;
      },
      getChartDashboard: function getChartDashboard() {
        return _chartDashboard;
      },
      getParser: function getParser() {
        return _parser;
      },
      setImportLog: function setImportLog(logInfo) {
        var _buffer = ['<table class="ink-table">'];
        for(var key in logInfo) {
          if (logInfo.hasOwnProperty(key)) {
            _buffer.push('<tr><td>' + key + '</td><td class="answer">' + logInfo[key] + '</td></tr>');
          }
        }
        _buffer.push('</table>');
        _logInfo = _buffer.join('');
      },
      getImportLog: function getImportLog() {
        return _logInfo;
      },
      setAwesompleteDiv: function setAwesompleteDiv (divUl) {
        _awesompleteDivUl = divUl;
      },
      clearWelcome: function clearWelcome() {
        options.welcome = '';
      }
    };
  };

  // node.js
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Terminal;

    // web browsers
  } else {
    var oldTerminal = global.Terminal;
    Terminal.noConflict = function () {
      global.Terminal = oldTerminal;
      return Terminal;
    };
    global.Terminal = Terminal;
  }

})(this);
