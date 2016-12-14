/* jshint node: true, esnext: true */

// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from 'path';
import url from 'url';
import { app, Menu } from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import { editMenuTemplate } from './menu/edit_menu_template';
import createWindow from './helpers/window';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

var mainWindow, docsWindow;

var setApplicationMenu = function () {
  var menus = [editMenuTemplate];
  if (env.name !== 'production') {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
  var userDataPath = app.getPath('userData');
  app.setPath('userData', userDataPath + ' (' + env.name + ')');
}

app.on('ready', function () {
  setApplicationMenu();

  mainWindow = createWindow('main', {
    minWidth: 800, 
    minHeight: 600,
    width: 980,
    height: 760, 
    autoHideMenuBar: true,
    webPreferences: {
      backgroundThrottling: false
    }
  });

  //mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  if (env.name === 'development') {
    mainWindow.openDevTools();
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
    docsWindow = null;
    app.quit();
  });

  docsWindow = createWindow('docs', {
    minWidth: 800, 
    minHeight: 600,
    width: 880,
    height: 660, 
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      backgroundThrottling: false
    }
  });

  //docsWindow.loadURL('file://' + __dirname + '/pages/documentation/index.html');

  docsWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/pages/documentation/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  docsWindow.on('close', (e) => {
    if (mainWindow !== null) {
      e.preventDefault();
      docsWindow.hide();
    }
  });
});
