import { ipcRenderer } from "electron";
const worker = require("../worker");

ipcRenderer.on("message-from-main", (event, arg) => {
  console.info("arg", arg);
  if (worker[arg.action]) {
    worker[arg.action](arg.data);
  }
});
