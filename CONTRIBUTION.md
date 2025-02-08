# Contribution rules

## variables rules:

+ __var__
    + _not used!_

+ __1 global object__
    + _global var: **memoryBar**_

+ __const__
    + _UPPER_CASE notation_
    + _Example:_
    ```js
        const CONFIG_PATH = "~/some/path.json";
    ```

+ __let__
    + _camelCase notation_
    + _all let variables are initialized!_
    + _Example_:
    ```js
        let configPath = "";
    ```

## function rules:
+ __nekofetch uses only arrow => functions__
    + _Example_:
    ```js
        const someFunc = (ConfigPath) => {};
    ```
+ __functions announced through const only with camelsCase notation__
    + _function main exception!_
    + _Example_:
    ```js
        const camelCase = (ConfigPath) => {};
    ```
+ __function arguments with PascalCase notation__
    + _Example_:
    ```js
        someFunc(configPath);
        const someFunc = (ConfigPath) => {};
    ```

## Other:
+  __CommonJS version with require__
    + _Example_:
    ```js
        const os = require("os");
    ```
+ __Comments are written before each function__
    + _Example_:
    ```js
        /*
        * get random ansi color
        *
        * @param {Number} RandomIndex
        * @param {Object} SomeObject
        *
        * @return {String} someString
        */
        const randomColor = (RandomIndex, SomeObject) => {
            return someString;
        };
    ```

+ __Errors__
    + _try catch(e)_
    + _console.error(``)_

+ __not use //TODO and something in code__
    +  __use https://github.com/fxhxyz4/nekofetch/issues/new with TODO label!__
    + __and read https://github.com/fxhxyz4/nekofetch/wiki/todo__
