"use strict";
class Master {
    constructor(){
        //Verify arguements
        this.analysisCommandLine();
        if (!this.options['url'] || !this.options['cache-dir']) {
            this.printCommandLineUsage();
        }

        //Critical Section
        //Class
        const Thread = require('./functions/thread');
        const WaitingList = require('./functions/holding');
        const URL = require('url').URL;
        const Path = require('path');

        //Attribute
        this.maxThreadNumber = this.options['thread'] && this.options['thread'] >= 1 ? this.options['thread'] : 5;
        this.currentThreadNumber = 0;
        this.ua = this.options['customized-ua'] ? this.options['customized-ua'] : 'Node-Static-Webpage-Crawler';
        this.baseUrl = new URL(this.options['url']);
        this.cachePath = this.options['cache-dir'];
        this.list = new WaitingList(this);
        this.startTime = new Date();

        //Action
        this.list.addPage(this.baseUrl.toString());

        setInterval(()=>{
            if (this.currentThreadNumber == 0){
                console.log('finish!');
                clearInterval(this);
                process.exit(0);
            }
        },10000);
    }
    
    analysisCommandLine(){
        //Command line arguements
        const commandLineArgument = require('command-line-args');
        const commandLineDefinition = [
            { name: 'url', alias:'u', type: String, multiple: false },
            { name: 'cache-dir', alias:'c', type: String, multiple: false },
            { name: 'thread', alias:'t', type: Number, multiple: false },
            { name: 'customized-ua', alias:'a', type: String, multiple: false }
        ];
        this.options = commandLineArgument(commandLineDefinition);
    }

    printCommandLineUsage() {
        // Print command line usage
        const commandLineUsage = require('command-line-usage');
        const commandLineSection = [
            {
                header: 'Node Static Webpage Crawler',
                content: 'Crawling webpage for caching uses.'
            },
            {
                header: 'Required Arguments',
                optionList: [
                    {
                        name: 'url',
                        alias: 'u',
                        description: 'Target URL.'
                    },
                    {
                        name: 'cache-dir',
                        alias: 'c',
                        description: 'Directory for all the cache files.'
                    }
                ]
            },
            {
                header: 'Options',
                optionList: [
                    {
                        name: 'thread',
                        alias: 't',
                        description: 'Although Node.js is single thread, the web crawler is not. (default value 5)'
                    },
                    {
                        name: 'customized-UA',
                        alias: 'ua',
                        description: 'A customized user agent in header field to identify this crawler.'
                    }
                ]
            }
        ];
        const usage = commandLineUsage(commandLineSection);
        console.log(usage);

        process.exit(0);
    }   
}

new Master();