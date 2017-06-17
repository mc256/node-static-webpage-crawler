const {URL} = require('url');

class WebPage {
    constructor (url, baseUrl){
        this.url = new URL(url, baseUrl);
        this.code = 0;
        this.lock = false;
        this.type = '';
        this.path = '';
    }
}

class WaitingList {
    constructor (mainThread){
        this.list = [];
        this.mainThread = mainThread;
    }

    addPage(urlString){
        const Thread = require('./thread');
        const Path = require('path');
        const Async = require('async');
        const fs = require('fs');
        const mkdirp = require('mkdirp');
        const item = new WebPage(urlString, this.mainThread.baseUrl);
        const main = this.mainThread;
        const list = this.list;

        Async.waterfall([
            //Check hostname
            (callback) => {
                if (item.url.hostname == main.baseUrl.hostname){
                    return callback(null);
                }
            },
            //Generate cachefile path
            (callback) => {
                item.path = Path.join(main.cachePath, item.url.pathname.endsWith('/') ? main.defaultIndex : decodeURI(item.url.pathname));
                if (Path.extname(item.path) == ''){
                    item.path += main.defaultExt;
                }
                return callback(null);
            },
            //Check if file exists
            (callback) => {
                fs.stat(item.path.toString(), (err, stats) => {
                    if (err){
                        return callback(null, true);
                    }else{
                        //compare stats.mtime and main.startTime 
                        if (main.startTime > stats.mtime) {
                            return callback(null, false);
                        }
                    }
                });
            },
            //Check if directory exist 
            (doCheck, callback) => {
                if (doCheck) {
                    fs.stat(Path.dirname(item.path), (err, stats) => {
                        if (err){
                            return callback(null, true);
                        }else{
                            return callback(null, false);
                        }
                    });
                }else{
                    return callback(null, false);
                }
            },
            //Create directories if needed
            (doCreate, callback) => {
                if (doCreate){
                    mkdirp(Path.dirname(item.path), (err, made) => {
                        if (made) {
                            console.log('Create Directory    : %s', made);
                        }                        
                        return callback(null);
                    });
                }else{
                    return callback(null);
                }
            },
            //Check waiting list
            (callback) => {
                if (!list.some((t, v, i, a) =>{
                    if (t.url.pathname == item.url.pathname){
                        return true;
                    }
                    return false;
                })){
                    list.push(item);

                    console.log("List        Add Page: %s", item.url.toString());

                    new Thread(main);
                };
                return callback(null);
            }
        ], (e, r) => {
            if (e){
                console.log(e,r);
            }
            
        });
    }


    getAvailablePage(){
        var item;
        if (this.list.some((t, v, i, a) => {
            if (t.lock == false && t.code == 0){
                t.lock = true;
                item = t;
                return true;
            }
            return false;
        })){
            return item;
        }else{
            return null;
        }
    }    
}

module.exports = WaitingList;