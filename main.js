#!/usr/bin/env node

/*
@==========================================================

  @Author: fxhxyz
  @Email: fxhsec@proton.me
  @Website: fxhxyz.vercel.app

  @R  _   _      _          __     _       _
  @R | \ | |    | |        / _|   | |     | |
  @R |  \| | ___| | _____ | |_ ___| |_ ___| |__
  @R | . ` |/ _ \ |/ / _ \|  _/ _ \ __/ __| '_ \
  @R | |\  |  __/   < (_) | ||  __/ || (__| | | |
  @R |_| \_|\___|_|\_\___/|_| \___|\__\___|_| |_|

@==========================================================
*/

/*
  * @NOTE of json config file
  * Default config: default.json
  *
  * Test config: config.json
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
const main = (ARGUMENTS) => {
  // ARGUMENTS for work with nodejs process.argv
  // console.log(ARGUMENTS);

  let config = {},
    infoArr = [],
    progressColor = "",
    color = "";

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

  /*
  * replace ~/ -> $HOME env
  *
  * @param {String} Path
  * @return {String} Path
  */
  const resolvePath = (Path) => Path.startsWith("/") || Path.startsWith("~") ? path.resolve(Path.replace(/^~/, process.env.HOME)) : path.resolve(baseDir, Path);

  // Get methods from os module
  let {
    uptime,
    platform,
    hostname,
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
    const BAR_LENGTH = 24;
    let blockCount = Math.floor(Percentage / (100 / BAR_LENGTH));

    progressColor = color;

    if (color === "\x1b[37m" || color === "\x1b[97m") {
      progressColor = "\x1b[90m";
    }

    let emptyCount = BAR_LENGTH - blockCount;
    let blockFilled = `\x1b[96m${progressColor}█`;

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
    try {
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

    } catch (e) {
      console.error(e);
      return;
    }
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

    return 0;
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
    let version = "Undefined";

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
      return;
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
    if (ip) {
      let nets = networkInterfaces();
      let ipRes = 0;

      for (const key in nets) {
        for (const net of nets[key]) {
          if (net.family === "IPv4" && !net.internal) {
            ipRes = net.address;

            return ipRes.trim();
          }
        }

        // next calls end
        if (ipRes) return;
      }
    }
  };

  /*
  * resolution info
  *
  * @return {String} result
  */
  const resolutionInfo = () => {
    let resolution = "";
    let result = "";

    try {
      if (os.platform() == "linux") {
        resolution = execSync('xrandr | grep "\\*"').toString().trim();
      } else if (os.platform() == "darwin") {
        resolution = execSync('system_profiler SPDisplaysDataType | grep "Resolution"').toString().trim();
      } else if (os.platform() == "win32") {
        resolution = execSync('wmic desktopmonitor get screenheight,screenwidth').toString().trim();
      }

      if (resolution) {
        const RESOLUTION_MATCH = resolution.match(/\d+x\d+/);
        result = RESOLUTION_MATCH ? RESOLUTION_MATCH[0] : 'not found';
      }

      return result;

    } catch (e) {
      console.error(e);
      return;
    }
  };

  /*
  * desktop environment
  *
  * @return {String} _de[0]
  */
  const deInfo = () => {
    const _de = process.env.XDG_CURRENT_DESKTOP ? process.env.XDG_CURRENT_DESKTOP.match(/(\w+)$/) : 0;

    if (_de) {
      return _de[0].trim();
    }

    return 0;
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
      return;
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

    try {
      if (os.platform() == "linux") {
        let gpuOut = execSync("lshw -C display").toString().trim();
        let prod = gpuOut.match(/product:\s(.*)/);

        gpu = prod && prod[1] ? prod[1].trim() : 'unknown';
      } else if (os.platform() == "win32") {
        gpu = execSync("wmic path win32_videocontroller get caption").toString().trim();
      } else if (os.platform() == "darwin") {
        gpu = execSync("system_profiler SPDisplaysDataType | grep 'Chipset Model'").toString().trim();
      }

      return gpu;

    } catch (e) {
      console.error(e);
      return;
    }
  };

  const getUserInfo = () => {
    let user = os.userInfo().username;

    return user;
  }

  const getHostInfo = () => {
    let host = os.hostname();

    return host;
  }

  const createFullUser = () => {
    let result = "";

    let host = getHostInfo();
    let user = getUserInfo();

    result += `\x1b[1m${color}${user}\x1b[0m@\x1b[1m${color}${host}`;
    return result;
  }

  const createHyphen = () => {
    const SYMB = "-";
    let hyphen = "";

    let user = getUserInfo();
    let host = getHostInfo();

    let len = `${user}@${host}`.length;

    for (let i = 0; i < len; i++) {
      hyphen += SYMB;
    }

    return hyphen;
  }

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

    let occupiedMemGB = (totalMemGB - freeMemGB).toFixed(0);

    let usedMemoryPercent = ((1 - freeMem / totalMem) * 100).toFixed(2);
    global.memoryBar = showProgressBar(usedMemoryPercent);

    result = `${occupiedMemGB}MiB / ${totalMemGB}MiB (${usedMemoryPercent}%)`;
    return result;
  };

  const displayOutput = () => {
    // create variables
    const _ = createHyphen();
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
      createFullUser(),
      `\x1b[0m${_}`,
      `\x1b[1m${color}OS:\x1b[0m ${_OS}`,
      `\x1b[1m${color}Host:\x1b[0m ${_HOST}`,
      `\x1b[1m${color}Kernel:\x1b[0m ${_KERNEL === 0 ? "" : _KERNEL}`,
      `\x1b[1m${color}Uptime:\x1b[0m ${_UPTIME}`,
      `\x1b[1m${color}Home:\x1b[0m ${_HOME}`,
      `\x1b[1m${color}Shell:\x1b[0m ${_SHELL}`,
      `\x1b[1m${color}Resolution:\x1b[0m ${_RESOLUTION}`,
      `\x1b[1m${color}DE:\x1b[0m ${_DE === 0 ? "" : _DE}`,
      `\x1b[1m${color}Terminal:\x1b[0m ${_TERMINAL}`,
      `\x1b[1m${color}IP:\x1b[0m ${ip === false ? "127.0.0.1" : _IP}`,
      `\x1b[1m${color}GPU:\x1b[0m ${_GPU}`,
      `\x1b[1m${color}CPU:\x1b[0m ${_CPU}`,
      `\x1b[1m${color}Memory:\x1b[0m ${_MEM}`,
      `\x1b[1m${color}Memory Scheme:\x1b[0m ${global.memoryBar}`,
    ];
  }

  // get path to config file
  let configPath = process.env.CONFIG_PATH ? resolvePath(process.env.CONFIG_PATH) : path.resolve(__dirname, "config", "default.json");

  if (!fs.existsSync(configPath)) {
    console.error(`Config file not found: ${configPath}`);
  }

  const parseConfig = () => {
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (e) {
      console.error(`Error reading config file: ${e}`);
    }
  }

  console.log("\n");

  parseConfig();

  let {
    image,
    imageParams,
    artPath,
    randomColor,
    foregroundColor,
    ip,
  } = config;

  /*
  * change terminal color with ansi codes
  *
  * @param {String} Foreground
  */
  const changeTerminalColor = (Foreground) => {
    console.log(Foreground);
    color = Foreground;
  };

  // create base directory
  const baseDir = path.dirname(path.join(configPath, ".."));

  artPath = artPath ? resolvePath(artPath) : path.join(baseDir, "assets/ascii.txt");

  if (imageParams && imageParams.path) {
    imageParams.path = resolvePath(imageParams.path);
  }

  if (!fs.existsSync(artPath)) {
    console.error(`ASCII file not found: ${artPath}`);
    return;
  }

  /*
  * type ascii
  *
  * @param {String} Input
  */
  const typeAscii = (Input) => {
    let asciiText;

    if (typeof Input === "string") {
      asciiText = Input.split("\n");
    } else if (Array.isArray(Input)) {
      asciiText = Input;
    } else {
      console.error("Invalid ASCII input");
      return;
    }

    displayOutput();

    console.log("\n\n");

    if (!Array.isArray(infoArr) || infoArr.length === 0) {
      console.error(`infoArr is empty`);
      return;
    }

    const maxLines = Math.max(asciiText.length, infoArr.length);
    const asciiPadded = [...asciiText, ...Array(maxLines - asciiText.length).fill("")];

    asciiPadded.forEach((line, index) => {
        const infoLine = infoArr[index] || "";
        console.log(`\x1b[1m${color}${line.padEnd(28)}  ${infoLine}\x1b[0m`);
    });

    console.log("\n");
  };

  const showASCII = async () => {
    try {
      if (!artPath || typeof artPath !== "string") {
        console.error(`Invalid ASCII art path`);
        return "";
      }

      if (!fs.existsSync(artPath)) {
        console.error(`ASCII-art file not found: ${artPath}`);
        return "";
      }

      let asciiText = fs.readFileSync(artPath, { encoding: "utf-8" }).split("\n");
      typeAscii(asciiText);

    } catch (e) {
      console.error(e);
      return;
    }
  };

  const showImage = async () => {
    if (!imageParams || !fs.existsSync(imageParams.path)) {
      console.error(`Image file not found: ${imageParams.path}`);
      return;
    }
    else {
      return new Promise((resolve, reject) => {
        asciify(imageParams.path, imageParams, (err, asciified) => {

          if (err) {
            reject(`Error displaying image: ${err}`);
            return;
          }

          typeAscii(asciified);
          resolve();
        });
      });
    }
  };

  const checkConfig = () => {
    try {
      if (randomColor) {
        let rnd = ANSI_FORE_COLORS[Math.floor(Math.random() * ANSI_FORE_COLORS.length)];

        changeTerminalColor(rnd);
      }

      if (foregroundColor && randomColor === false) {
        changeTerminalColor(foregroundColor);
      }

      if (image) {
        showImage();
      } else if (artPath && image === false) {
        showASCII();
      } else {
        console.error(`Neither image nor ASCII path provided.`);
        return;
      }
    } catch (e) {
        console.error(e);
        return;
    }
  };

  // CONFIG statement
  if (config) checkConfig();
}

main(ARGUMENTS);
