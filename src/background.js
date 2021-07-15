"use strict";
import { app, protocol, BrowserWindow, Menu, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);
function createMenu() {
  // darwin表示macOS，针对macOS的设置
  if (process.platform === "darwin") {
    const template = [
      {
        label: "App Demo",
        submenu: [
          {
            role: "about",
          },
          {
            role: "quit",
          },
        ],
      },
      {
        label: "Edit",
        submenu: [
          { label: "复制", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "粘贴", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "剪切", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "全选", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
          { label: "全选", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
        ],
      },
    ];
    let menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    // windows及linux系统
    Menu.setApplicationMenu(null);
  }
}
let win = null;
let workerWindow = null;
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 1200,
    show: false,
    minWidth: 800,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false,
    },
  });
  win.once("ready-to-show", () => {
    win.show();
  });
  // 共享给vue的数据
  global.sharedObject = {
    STORE_PATH: app.getPath("userData"),
  };
  // electron.remote.getGlobal('sharedObject')

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
    // win.webContents.openDevTools();
  }
  createMenu();
  app.setName("语料转换工具");
  workerWindow = new BrowserWindow({
    show: process.env.WEBPACK_DEV_SERVER_URL ? true : false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  // workerWindow.on("closed", () => {
  //   console.log("background window closed");
  // });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await workerWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    workerWindow.webContents.openDevTools();
  } else {
    await workerWindow.loadURL("app://./index.html");
  }

  // workerWindow.webContents.openDevTools();
}
// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS_DEVTOOLS);
  //   } catch (e) {
  //     console.error("Vue Devtools failed to install:", e.toString());
  //   }
  // }
  createWindow();
  ipcMain.on("message-from-worker", (event, arg) => {
    sendWindowMessage(win, "message-to-renderer", arg);
  });
  ipcMain.on("message-from-renderer", (event, arg) => {
    sendWindowMessage(workerWindow, "message-from-main", arg);
  });
  ipcMain.on("ready", (event, arg) => {
    console.info("child process ready");
  });
  // setTimeout(() => {
  //   console.info("child process ready");
  //   console.log(workerWindow);
  //   sendWindowMessage(workerWindow, "message-from-main", {
  //     action: "goToWorker",
  //   });
  // }, 2000);
});
function sendWindowMessage(targetWindow, message, payload) {
  if (typeof targetWindow === "undefined") {
    console.log("Target window does not exist");
    return;
  }
  if (targetWindow.webContents) {
    targetWindow.webContents.send(message, payload);
  }
}
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
