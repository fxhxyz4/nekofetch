#!/usr/bin/env node

/*
==========================================================

  Author: fxhxyz
  Email: fxhxyz7@proton.me
  Website: fxhxyz.vercel.app

   _   _      _          __     _       _
  | \ | |    | |        / _|   | |     | |
  |  \| | ___| | _____ | |_ ___| |_ ___| |__
  | . ` |/ _ \ |/ / _ \|  _/ _ \ __/ __| '_ \
  | |\  |  __/   < (_) | ||  __/ || (__| | | |
  |_| \_|\___|_|\_\___/|_| \___|\__\___|_| |_|

==========================================================
*/

/*
  * NOTE of json config file
  * Default config: default.json
  *
  * https://github.com/fxhxyz4/nekofetch/wiki/config
  * ------------------------------------------------
*/

const { execSync } = require("child_process");
const asciify = require('asciify-image');
const process = require("process");
const path = require("path");
const fs = require("fs");
const os = require("os");

const ARGUMENTS = process.argv;

/*
* Main - главшпан
* @param {Array} ARGUMENTS
*/
const Main = (ARGUMENTS) => {
  // ARGUMENTS for work with nodejs process.argv

  const ANSI_FORE_COLORS = [
    "\u001B[97m", // Bright White (Best for black background)
    "\u001B[96m", // Bright Cyan
    "\u001B[95m", // Bright Magenta
    "\u001B[94m", // Bright Blue
    "\u001B[93m", // Bright Yellow
    "\u001B[92m", // Bright Green
    "\u001B[91m", // Bright Red
    "\u001B[90m", // Bright Black (Gray)
    "\u001B[37m", // White
    "\u001B[36m", // Cyan
    "\u001B[35m", // Magenta
    "\u001B[34m", // Blue
    "\u001B[33m", // Yellow
    "\u001B[32m", // Green
    "\u001B[31m", // Red
    "\u001B[30m", // Black (Only for light backgrounds)
  ];

  let infoArr = [], color = "", asciiText = "";

  /*
  * replace ~/ -> $HOME env
  *
  * @param {String} FilePath
  * @return {String} FilePath
  */
  const expandPath = (FilePath) => FilePath.replace(/^~/, process.env.HOME);

  /*
  * resolve path to ascii art
  * typed path or default.json path
  */
  const CONFIG_PATH = process.env.CONFIG_PATH
    ? path.resolve(expandPath(process.env.CONFIG_PATH))
    : path.resolve(__dirname, "./config/default.json");

  if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`Config file not loaded: ${CONFIG_PATH}`);
    process.exit(1);
  }

  const CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));

  console.log("\n");

  /*
  * load ASCII-art
  *
  * @param {String} AsciiPath
  * @return {String} asciiText
  */
  const checkAsciiPath = (AsciiPath) => {
    let resolvedPath = AsciiPath ? path.resolve(expandPath(AsciiPath)) : path.join(__dirname, "assets", "ascii.txt");

    if (!fs.existsSync(resolvedPath)) {
      console.error(`ASCII-art file not found: ${resolvedPath}`);
      return [];
    }

    asciiText = fs.readFileSync(resolvedPath, { encoding: "utf-8" }).split("\n");

    return asciiText;
  };

  /*
  * type image
  *
  * @param {Object} {ImageParam}
  */
  const typeImage = async (ImageParams) => {
    return new Promise((resolve, reject) => {
      asciify(ImageParams.path, ImageParams, (err, asciified) => {

        if (err) {
            reject(`Error displaying image: ${err}`);
            return;
        }

        typeAscii(asciified);
        resolve();
      });
    });
};

  /*
  * display image and ascii art
  */
  const displayOutput = async () => {
      const { image, imageParams, artPath } = CONFIG;

      if (image) {
          try {
              await typeImage(imageParams);
          } catch (e) {
              console.error(e);
          }
      } else {
          typeAscii(artPath);
      }
  };

  /*
  * type ascii
  *
  * @param {String} Input
  */
  const typeAscii = (Input) => {
      let asciiText;

      if (typeof Input === "string" && Input.includes("\n")) {
          asciiText = Input.split("\n");
      } else {
          asciiText = checkAsciiPath(Input);
      }

      console.log(`\n\n`);

      const maxLines = Math.max(asciiText.length, infoArr.length);
      const asciiPadded = [...asciiText, ...Array(maxLines - asciiText.length).fill("")];

      asciiPadded.forEach((line, index) => {
          const infoLine = infoArr[index] || "";
          console.log(`\x1b[1m${color}${line.padEnd(30)}  ${infoLine}\x1b[0m`);
      });

      console.log(`\n\n`);
  };

  /*
  * change terminal color with ansi codes
  *
  * @param {String} Foreground
  */
  const changeTerminalColor = (Foreground) => {
    console.log(Foreground);
    color = Foreground;
  };

  /*
  * check config
  *
  * @param {Object} {Conf}
  */
  const checkConfig = (Conf) => {
    try {
        let { image, imageParams, artPath, randomColor, foregroundColor } = Conf;

      if (artPath) {
        checkAsciiPath(artPath);
      } else if (image === true) {
        typeImage(image);
      } else {
        console.error(`Neither image nor ASCII path provided.`);
      }

      if (randomColor) {
        color = ANSI_FORE_COLORS[Math.floor(Math.random() * ANSI_FORE_COLORS.length)];

        changeTerminalColor(color);
      }

      if (foregroundColor && randomColor === false) {
        color = foregroundColor;
        changeTerminalColor(color);
      }

    } catch (e) {
        console.error(e);
    }
  };

  // CONFIG statement
  if (CONFIG) checkConfig(CONFIG);

  // Get methods from os module
  const {
    uptime,
    platform,
    hostname,
    machine,
    networkInterfaces,
    cpus,
    userInfo
  } = os;

  /*
  * show memory bar
  *
  * @param {String} Percentage
  */
  const showProgressBar = (Percentage) => {
    const BAR_LENGTH = 20;
    let blockCount = Math.floor(Percentage / (100 / BAR_LENGTH));

    let emptyCount = BAR_LENGTH - blockCount;
    let blockFilled = `\x1b[96m${color}█`;

    let blockEmpty = "\x1b[37m█";
    let resetColor = "\x1b[0m";

    let progressBar = "";

    for (let i = 0; i < blockCount; i++) {
      progressBar += blockFilled;
    }

    for (let i = 0; i < emptyCount; i++) {
      progressBar += blockEmpty;
    }

    return progressBar + resetColor;
  };

  /*
  * os name & arch version
  *
  * @return {String} resultString
  */
  const osInfo = () => {
    let resultString = "";

    const archVersion = os.arch() === "x64" ? "x86_64" : os.arch();
    let osName = platform();

    if (osName == "linux") {
      if (fs.existsSync("/etc/os-release")) {
        let osRelease = fs.readFileSync("/etc/os-release", "utf-8");

        const MATCH = osRelease.match(/^PRETTY_NAME="(.+)"$/m);
        if (MATCH) osName = MATCH[1];
      }
    } else if (osName == "win32") {
      try {
        osName = execSync('wmic os get Caption', { encoding: "utf-8" })
          .split("\n")[1]
          .trim();
      } catch {
        osName = "Windows (Unknown Version)";
      }
    } else if (osName == "darwin") {
      osName = execSync("sw_vers -productName", { encoding: "utf-8" }).trim();

      const VERSION = execSync("sw_vers -productVersion", { encoding: "utf-8" }).trim();
      osName += ` ${VERSION}`;
    }

    resultString = `${osName} ${archVersion}`;
    return resultString;
  };

  /*
  * host name info
  *
  * @return {String} resultString
  */
  const hostInfo = () => {
    let resultString = "";

    const HOST_NAME = hostname();
    let model = "Unknown Model";

    if (os.platform() === "linux") {
      if (fs.existsSync("/sys/class/dmi/id/product_name")) {
        model = fs.readFileSync("/sys/class/dmi/id/product_name", "utf-8").trim();
      }
    } else if (os.platform() === "darwin") {
      try {
        model = execSync("system_profiler SPHardwareDataType | grep 'Model Identifier'", {
          encoding: "utf-8",
        })
          .split(":")[1]
          .trim();
      } catch {
        model = "Mac (Unknown Model)";
      }
    } else if (os.platform() === "win32") {
      try {
        model = execSync('wmic computersystem get Model', { encoding: "utf-8" })
          .split("\n")[1]
          .trim();
      } catch {
        model = "Windows PC (Unknown Model)";
      }
    }

    resultString = `${HOST_NAME} ${model}`;
    return resultString;
  };

  /*
  * kernel info
  *
  * @return {String} kernelInfo
  */
  const kernelInfo = () => {
    let kernel;

    if (os.platform() == "linux") {
      kernel = execSync("uname -r");

      let kernelInfo = kernel.toString().trim();
      return kernelInfo;
    }

    return null;
  };

  /*
  * uptime info
  *
  * @return {String} uptimeStr
  */
  const uptimeInfo = () => {
    let uptimeSec = uptime();

    const YEARS = Math.floor(uptimeSec / (3600 * 24 * 365));
    const MONTHS = Math.floor((uptimeSec % (3600 * 24 * 365)) / (3600 * 24 * 30));

    const WEEKS = Math.floor((uptimeSec % (3600 * 24 * 30)) / (3600 * 24 * 7));
    const DAYS = Math.floor((uptimeSec % (3600 * 24 * 7)) / (3600 * 24));

    const HOURS = Math.floor((uptimeSec % (3600 * 24)) / 3600);
    const MINUTES = Math.floor((uptimeSec % 3600) / 60);

    let uptimeStr = "";

    if (YEARS > 0) uptimeStr += `${YEARS}y `;
    if (MONTHS > 0) uptimeStr += `${MONTHS}mo `;

    if (WEEKS > 0) uptimeStr += `${WEEKS}w `;
    if (DAYS > 0) uptimeStr += `${DAYS}d `;

    if (HOURS > 0) uptimeStr += `${HOURS}h `;
    if (MINUTES > 0) uptimeStr += `${MINUTES}m`;

    return uptimeStr.trim();
  };

  /*
  * home directory
  *
  * @return {String} homeDir
  */
  const homeInfo = () => {
    const HOME_INFO = userInfo();
    let homeDir = HOME_INFO.homedir;

    return homeDir.trim();
  };

  /*
  * shell info
  *
  * @return {String} resultString
  */
  const shellInfo = () => {
    let resultString = "";
    const SHELL_INFO = userInfo();

    let shell = SHELL_INFO.shell || "unknown";
    let version = null;

    const shells = ["bash", "zsh", "fish", "csh", "tcsh", "dash", "sh", "ksh"];

    for (const sh of shells) {
      if (shell.includes(sh)) {
        shell = sh;
        break;
      }
    }

    try {
      version = execSync(`${shell} --version`).toString().trim();
      const VERSION_MATCH = version.match(/(?:version\s)([\d\.]+[\w\.-]*)/);

      if (VERSION_MATCH) {
        return `${shell} ${VERSION_MATCH[1]}`
      }
    } catch (e) {
      console.error(`Error fetching version for ${shell}: `, e);
    }

    resultString = `${shell}`;
    return resultString;
  };

  /*
  * ip info
  *
  * @return {String} ip
  */
  const ipInfo = () => {
    if (CONFIG.ip) {
      let nets = networkInterfaces();
      let ip = null;

      for (const key in nets) {
        for (const net of nets[key]) {
          if (net.family === "IPv4" && !net.internal) {
            ip = net.address;

            return ip.trim();
          }
        }

        if (ip) return;
      }
    }
  };

  /*
  * resolution info
  *
  * @return {String} result
  */
  const resolutionInfo = () => {
    let resolution = null;
    let result = "";

    if (os.platform() == "linux") {
      resolution = execSync('xrandr | grep "\\*"').toString().trim();
    } else if (os.platform() == "darwin") {
      resolution = execSync('system_profiler SPDisplaysDataType | grep "Resolution"').toString().trim();
    } else if (os.platform() == "win32") {
      resolution = execSync('wmic desktopmonitor get screenheight,screenwidth').toString().trim();
    }

    const RESOLUTION_MATCH = resolution.match(/\d+x\d+/);
    result = RESOLUTION_MATCH ? RESOLUTION_MATCH[0] : 'not found';

    return result;
  };

  /*
  * desktop environment
  *
  * @return {String} _de[0]
  */
  const deInfo = () => {
    const _de = process.env.XDG_CURRENT_DESKTOP ? process.env.XDG_CURRENT_DESKTOP.match(/(\w+)$/) : null;

    if (_de) {
      return _de[0].trim();
    }

    return null;
  };

  /*
  * terminal
  *
  * @return {String} terminal
  */
  const terminalInfo = () => {
    let terminal = "unknown";

    try {
      if (os.platform() == "linux" || os.platform() == "darwin") {
        terminal = execSync('ps -p $$ -o comm=').toString().trim();
      } else if (os.platform() == "win32") {
        terminal = execSync('echo $env:Term').toString().trim();
      }

      return terminal;
    } catch (e) {
      console.error(e);
    }
  };

  /*
  * get cpu info
  *
  * @return {String} model
  */
  const cpuInfo = () => {
    const CPU = cpus();
    let model = CPU[0].model;

    return model.trim();
  };

  /*
  * get gpu info
  *
  * @return {String} gpu
  */
  const gpuInfo = () => {
    let gpu = "unknown";

    if (os.platform() == "linux") {
      let gpuOut = execSync("lshw -C display").toString().trim();
      let prod = gpuOut.match(/product:\s(.*)/);

      gpu = prod ? prod[1] : 'unknown';
    } else if (os.platform() == "win32") {
      gpu = execSync("wmic path win32_VideoController get name").toString().trim();
    } else if (os.platform() == "darwin") {
      gpu = execSync("system_profiler | grep GeForce").toString().trim();
    }

    return gpu;
  };

  /*
  * get memory info
  *
  * @return {String} result
  */
  const memoryInfo = () => {
    let result = "";

    let freeMem = os.freemem();
    let totalMem = os.totalmem();

    let freeMemGB = (freeMem / 1024 / 1024 ).toFixed(0);
    let totalMemGB = (totalMem / 1024 / 1024 ).toFixed(0);

    let usedMemoryPercent = ((1 - freeMem / totalMem) * 100).toFixed(2);
    global.memoryBar = showProgressBar(usedMemoryPercent);

    result = `${freeMemGB}MiB / ${totalMemGB}MiB (${usedMemoryPercent}%)`

    return result;
  };

  // create variables
  const _OS = osInfo();
  const _HOST = hostInfo();
  const _KERNEL = kernelInfo();
  const _UPTIME = uptimeInfo();
  const _HOME = homeInfo();
  const _SHELL = shellInfo();
  const _IP = ipInfo();
  const _RESOLUTION = resolutionInfo();
  const _DE = deInfo();
  const _TERMINAL = terminalInfo();
  const _CPU = cpuInfo();
  const _GPU = gpuInfo();
  const _MEM = memoryInfo();

  // output info array
  // with color
  infoArr = [
    `\x1b[1m${color}OS:\x1b[0m ${_OS}`,
    `\x1b[1m${color}Host:\x1b[0m ${_HOST}`,
    `\x1b[1m${color}Kernel:\x1b[0m ${_KERNEL == null ? "" : _KERNEL}`,
    `\x1b[1m${color}Uptime:\x1b[0m ${_UPTIME}`,
    `\x1b[1m${color}Home:\x1b[0m ${_HOME}`,
    `\x1b[1m${color}Shell:\x1b[0m ${_SHELL}`,
    `\x1b[1m${color}Resolution:\x1b[0m ${_RESOLUTION}`,
    `\x1b[1m${color}DE:\x1b[0m ${_DE == null ? "" : _DE}`,
    `\x1b[1m${color}Terminal:\x1b[0m ${_TERMINAL}`,
    `\x1b[1m${color}IP:\x1b[0m ${CONFIG.ip === false ? "127.0.0.1" : _IP}`,
    `\x1b[1m${color}GPU:\x1b[0m ${_GPU}`,
    `\x1b[1m${color}CPU:\x1b[0m ${_CPU}`,
    `\x1b[1m${color}Memory:\x1b[0m ${_MEM}`,
    `\x1b[1m${color}Memory Scheme:\x1b[0m ${global.memoryBar}`,
  ];

  displayOutput();
}

Main(ARGUMENTS);
