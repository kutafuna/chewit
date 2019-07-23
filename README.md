# chewit

[![INC](https://img.shields.io/badge/%E2%9C%A8-IdeasNeverCease/chewit-51dcfb.svg?style=flat-square)](https://code.webb.page/IdeasNeverCease/chewit) ![download count](https://img.shields.io/npm/dt/chewit.svg?style=flat-square) ![npm version](https://img.shields.io/npm/v/chewit.svg?style=flat-square)

> Analytics you can count on



## Installation

```bash
$ npm i chewit -S
```

Note that this module requires an account with [Chew](https://chew.sh), currently in alpha.



## Features

- **namespaced modules:** just use what you need!
- **server-side analytics:** no need to muddy up your beautiful front-end with tracking snippets!
- **super simple:** less than 3 lines of code on your part, wonderful!



## Examples

### Express

```js
const chew = require("chewit/express");

const app = express()
  // ...after setting views, body parsing, &c
  .use(chew("YOUR-SITE-ID"));

// Make sure Chew is the very last middleware in your app.
// You'll get a lot of nonsense in your analytics otherwise.
// Working on a fix for this.
```

### Fastify

```js
fastify.register(require("chewit/fastify"), {
  id: "YOUR-SITE-ID"
});
```



## Note

This module follows ChronVer, [visit this site](https://chronver.org "ChronVer homepage") for more info.
