class WebCrawler {
    constructor(item, main, callback){
        this.item = item;
        this.main = main;
        this.pageContent = null;
        this.callback = callback;

        const https = require('https');
        const options = {
            hostname: item.url.hostname,
            method: 'GET',
            path: item.url.pathname + (item.url.search ? '?' + item.url.search : ''),
            headers: {
                'user-agent' : this.main.ua
            }
        }
        //console.log(options);
        const request =  https.request(options, (r) => { this.requestCallback(r); });
        request.on('error', (e) => { this.dataError(e); });
        request.end();
    }

    requestCallback(response){
        this.item.code = response.statusCode;
        this.item.type = response.headers['content-type'];

        //console.log('Crawler    Header   : %d - %s - %s', this.item.code, this.item.type, this.item.url.toString());
        
        response.setEncoding('binary');

        response.on('data', (d) => { this.dataReceiving(d); });
        response.on('end', (d) => { this.dataFinished(d); });
    }

    dataReceiving(data){
        if (this.pageContent == null){
            this.pageContent = data;
        }else{
            this.pageContent += data;
        }
    }

    dataFinished(data){
        if (this.pageContent == null && !data){
            this.pageContent = data;
        }else{
            this.pageContent += data;
        }

        //console.log('Crawler    Finished : %d - %s - %s', this.item.code, this.item.type, this.item.url.toString());

        this.callback();
    }

    dataError(){
        this.item.code = 0;

        //console.log('Crawler    Error    : %s', this.item.url.toString());
    }

}

module.exports = WebCrawler;