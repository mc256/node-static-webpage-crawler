# static-webpage-crawler

This is a very simple web crawler. You can use this to download your ENTIRE website. You may also combine this small program with Nginx to build a reverse proxy for you website.

**This Package requires Node.js 8**

## Install

```
npm i static-webpage-crawler
```

## Use it

```
node  static-webpage-crawler --url=YOURDOMAIN --cache-dir=YOURDIRECTORY
```

You may use it with Nginx

```
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
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

