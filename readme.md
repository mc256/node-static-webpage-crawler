# static-webpage-crawler

This is a very simple web crawler. You can use this to download your ENTIRE website. You may also combine this small program with Nginx to build a reverse proxy for you website.

**This Package requires Node.js 8**

## Install

```
npm i static-webpage-crawler
```

## Use it

```
node  static-webpage-crawler --url=YOURDOMAIN --cache-dir=YOURDIRECTORY/
```

### Required Arguments

  **-u, --url**          Target URL.

  **-c, --cache-dir**    Directory for all the cache files.

### Options

  **-t, --thread**                    Although Node.js is single thread, the web crawler is not.
                                  (default is 5)

  **-a, --customized-ua**             A customized user agent in header field to identify this crawler.

  **-i, --index-page**                Default index page. (index.html)

  **-e, --default-page-extension**    Default page extension. Do not forget the PERIOD in front of it.
                                  (.html)

  **--use-http**                      Use deprecated HTTP insecure connection. (not recommanded)




You may also use it with Nginx

```
server {
        ...
        root YOURDIRECTORY;

        location / {
                try_files       /$host$request_uri
                                /$host$request_uri.html
                                /$host$request_uri/index.html
                                /$host$request_uri"index.html"
                                @pass_proxy;
        }

        location @pass_proxy {
                proxy_pass https://backend;
                ...
        }
        ...
}

```





## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

