# Contribution rules

## variables rules:

- **var**

  - _not used!_

- **1 global object**

  - _global var: **memoryBar**_

- **const**

  - _UPPER_CASE notation_
  - _Example:_

  ```js
  const CONFIG_PATH = '~/some/path.json';
  ```

- **let**
  - _camelCase notation_
  - _all let variables are initialized!_
  - _Example_:
  ```js
  let configPath = '';
  ```

## function rules:

- **nekofetch uses only arrow => functions**
  - _Example_:
  ```js
  const someFunc = ConfigPath => {};
  ```
- **functions announced through const only with camelsCase notation**
  - _function main exception!_
  - _Example_:
  ```js
  const camelCase = ConfigPath => {};
  ```
- **function arguments with PascalCase notation**
  - _Example_:
  ```js
  someFunc(configPath);
  const someFunc = ConfigPath => {};
  ```

## Other:

- **CommonJS version with require**
  - _Example_:
  ```js
  const os = require('os');
  ```
- **Comments are written before each function**

  - _Example_:

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

- **Errors**

  - _try catch(e)_
  - _console.error(``)_

- **not use //TODO and something in code**
  - **use https://github.com/fxhxyz4/nekofetch/issues/new with TODO label!**
  - **and read https://github.com/fxhxyz4/nekofetch/wiki/todo**
