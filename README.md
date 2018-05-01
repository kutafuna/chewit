# chewit

[![INC](https://img.shields.io/badge/%F0%9F%92%A1-IdeasNeverCease/chewit-07d0eb.svg?style=flat-square)](https://git.inc.sh/IdeasNeverCease/chewit)

> Analytics you can count on



### Installation

```bash
$ npm i
```



### Integration

Sign up for an account on [Chew](https://chew.sh) and apply your site's code in your Express app like so:

```javascript
import chew from "chewit";

const app = express()
  // ...after setting views, body parsing, &c
  .use(chew("YOUR-SITE-ID"));
```

Make sure Chew is the very last middleware in your app (or at least place it after your body parser middleware). You'll get a lot of nonsense in your analytics otherwise.
