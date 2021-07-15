const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "./",
  devServer: {
    // can be overwritten by process.env.HOST
    host: "0.0.0.0",
    port: 8080,
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      productName: "预料转换工具",
      builderOptions: {
        asar: false,
        files: ["**/*", "**/node_modules/**/*", "**/src/**/*"],
        buildDependenciesFromSource: true,
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("src", resolve("src"))
      .set("common", resolve("src/common"))
      .set("components", resolve("src/components"));
  },
};
