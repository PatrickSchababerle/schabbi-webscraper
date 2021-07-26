const fs = require('fs');

/**
 * Helper Module for Crawler Queue
 * @module Queue
 */

class Queue {
    constructor(){
        this.elements = [];
        this.run_id = new Date().valueOf();
        this.loggers = {};
        this.log_dir = __dirname + '/logs/';
        this.init_logger = (async () => {
            await new Promise((resolve) => {
                fs.mkdir(this.log_dir, { recursive: true }, () => {
                    resolve();
                });
            });
        })();
    }

    /**
     * Add element to queue
     * @param  {any} e                  Element to be queued
     */

    enqueue(e){
        this.elements.push(e);
        this.logger('info', '>> Enqueued | ' + e);
    }

    /**
     * Remove first element in queue
     * @return {class}                  Returning current instance of queue
     */

    dequeue() {
        const e = this.elements.shift();
        this.logger('info', '>> Dequeued | ' + e);
        return e;
    }

    /**
     * Detect if queue is empty
     * @return {boolean}
     */

    isEmpty() {
        return this.elements.length == 0;
    }

    /**
     * Get next element in queue
     * @return {any}                    Returning next element in queue
     */

    peek() {
        return !this.isEmpty() ? this.elements[0] : undefined;
    }

    /**
     * Get length of queue
     * @return {int}                    Returning current length of queue
     */

    length() {
        return this.elements.length;
    }

    /**
     * Detect if queue contains certain element
     * @param  {any} e                  Element to be searched for
     * @return {boolean}
     */

    contained(e) {
        return (this.elements.indexOf(e) > -1);
    }

    /**
     * List all elements in queue
     * @return {array}                  Returning array of queue
     */

    list() {
        return this.elements;
    }

    logger(level, message) {
        const file = this.log_dir + level + '.log';
        const self = this;
        new Promise((resolve) => {
            if(!fs.existsSync(file)) {
                fs.writeFile(file, '', () => {
                    resolve();
                });
            } else {
                resolve();
            }
        }).then(() => {
            self.loggers[level] = fs.createWriteStream(file, {flags : 'a'});
        }).then(() => {
            this.loggers[level].write('Run ID: ' + this.run_id + ' -- ' + new Date() + ' | ' + message + '\n');
        });
    }
}

module.exports = Queue;