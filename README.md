![Convolv Icon](https://convo.lv/img/convolv-avatar-forall.png) ![Convolv Logo](https://convo.lv/img/convolv-logo.png)

The Convolv Desktop
==============
A quad-console, desktop application based on the [Convolv web app](https://github.com/scribeGriff/math-terminal). It is built for the [Electron runtime](http://electron.atom.io) and uses the [electron-boilerplate](https://github.com/szwacz/electron-boilerplate) as a development platform.

## Overview
Convolv is a desktop application that provides four independant consoles and a central dashboard for the analysis of data. Built with vanilla JS and incorporating more than a dozen open-source libraries, the application allows a user to import data, perform numerical analyses and chart the results, both to the console's chart window as well as to a common dashboard shared by all four consoles.

### Quick Start

This project uses the awesome [electron-boilerplate](https://github.com/szwacz/electron-boilerplate), so please refer to that repo for tips and notes regarding building and developing.  To quickly launch the app on your desktop in development mode, just enter the following commands:

```
git clone https://github.com/scribeGriff/convolv-desktop.git
cd convolv-desktop
npm install
npm start
```

This assumes that you have [Node.js](https://nodejs.org) already installed.

### Build the Application

A pre-built setup executable for Windows is available in the dist folder.  Simply download and launch the setup binary to install the Convolv application on your PC (note that this app is unsigned and you will need to grant permission for it to be installed).  For Mac and Linux users, or for PC users who would prefer to build their own setup executable, assuming you have already followed the steps in the Quick Start, just run the following additional command:

```
npm run release
```
This will create a dist folder in your local project directory which will contain the necessary installation file for your computer.

## Details

### Number Crunching 

Besides having built-in support for the powerful [Math.js](http://mathjs.org/) library, additional features have been incorporated including:
- Simple waveform generator: square, pulse, triangular, etc.
- Polynomial string construction for latex output
- Common signal processing algorithms including (more are in development):   
`fft()`: fast and discrete Fourier transform   
`ifft()`: fast and discrete inverse Fourier transform  
`fsps()`: partial sums of Fourier series   
`conv()`: convolution   
`deconv()`: deconvolution (polynomial division)  
`corr()`: cross and auto correlation   
`filter()`: a 1D transposed direct form II digital filter structure

### Charts

We've also included the awesome [Highcharts](http://www.highcharts.com/products/highcharts) library to provide support for the following chart types:
- line
- curve
- log
- sample
- area
- bar
- column
- polar
- pie

### Data

Data can be entered manually or imported/exported as:
- csv from a local drive
- JSON data from a URL (support for tokens is available)

In addition, JSON data imported from a URL can be displayed in a datatable.

### Screenshots

![Convolv Import Data from URL](https://convo.lv/img/convolv-04-screenshot.jpg)

![Convolv Import and Export to File](https://convo.lv/img/convolv-08-screenshot.jpg)

## Credits

#### Note: The libraries below are covered by their respective licenses.

Convolv is only a reality thanks to these amazing Github projects:

- [Highcharts](https://github.com/highcharts/highcharts)
- [MathJS](https://github.com/josdejong/mathjs)
- [Electron Boilerplate](https://github.com/szwacz/electron-boilerplate)
- [KaTeX](https://github.com/Khan/KaTeX)
- [Awesomplete](https://github.com/LeaVerou/awesomplete)
- [Terminal](https://github.com/SDA/terminal)
- [Fetch](https://github.com/github/fetch)
- [Moment](https://github.com/moment/moment)
- [FileSaver.js](https://github.com/eligrey/FileSaver.js)
- [Ink](https://github.com/sapo/Ink)
- [PapaParse](https://github.com/mholt/PapaParse)
- [Split](https://github.com/nathancahill/Split.js)
- [Hack](https://github.com/chrissimpkins/Hack)
- [Datatable](https://github.com/Holt59/datatable)
- [FontAwesome](https://github.com/FortAwesome/Font-Awesome)
- [Codrops](https://github.com/codrops)
- [Bulma](https://github.com/jgthms/bulma)
- [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll)
- [ES6 Shim](https://github.com/paulmillr/es6-shim)

## License

MIT. Please see the [license](LICENSE.md) file.

