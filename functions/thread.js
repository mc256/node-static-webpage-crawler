class WorkingThread {
    constructor (mainThread){
        this.mainThread = mainThread;
        this.threadID = -1;

        // Nodejs is single thread. Therefore, it is safe to do so.
        // I don't know. This is my firt program in Nodejs.
        if (this.mainThread.currentThreadNumber < this.mainThread.maxThreadNumber) {
            this.mainThread.currentThreadNumber++;
            this.threadID = this.mainThread.currentThreadNumber;
        }else{
            return;
        }

        this.launch();
    }

    launch(){

        this.item = this.mainThread.list.getAvailablePage();
        if (!this.item) {
            this.teardown();
            return;
        }
        console.log("Thread[%d/%d] Get Page: %s", this.threadID, this.mainThread.maxThreadNumber, this.item.url.toString());

        const WebCrawler = require('./crawler');
        this.crawler = new WebCrawler(this.item, this.mainThread, () => { this.process(); });

    }

    process(){
        if ( this.item.code == 200 ){
            //write to file
            const fs = require('fs');
            fs.writeFile(this.item.path, this.crawler.pageContent, 'binary', (err) => {
                if (err) {
                    console.log(err);
                }
            })
            console.log("Thread[%d/%d] Write To: %s", this.threadID, this.mainThread.maxThreadNumber, this.item.path);

            if ( this.item.type && this.item.type.startsWith('text/html') ){
                this.parseLinks();
            }
        }
        this.launch();
    }

    parseLinks(){
        //find links
        const Cheerio = require('cheerio');
        const $ = Cheerio.load(this.crawler.pageContent);
        const links = $('a');
        links.each((index, element) => {
            try{
                if (element.attribs['href']){
                    this.mainThread.list.addPage(element.attribs['href'], this.item.url.toString());
                }                
            }catch(error){
                console.log(error);
            }
        })
        const imgs = $('img');
        imgs.each((index, element) => {
            try{
                if (element.attribs['href']){
                    this.mainThread.list.addPage(element.attribs['href'], this.item.url.toString());
                }
            }catch(error){
                console.log(error);
            }
        })
    }

    teardown(){
        this.mainThread.currentThreadNumber--;
    }
}

module.exports = WorkingThread;