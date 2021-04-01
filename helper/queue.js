/**
 * Helper Module for Crawler Queue
 * @module Queue
 */

class Queue {
    constructor(){
        this.elements = [];
    }

    /**
     * Add element to queue
     * @param  {any} e                  Element to be queued
     */

    enqueue(e){
        this.elements.push(e);
    }

    /**
     * Remove first element in queue
     * @return {class}                  Returning current instance of queue
     */

    dequeue() {
        return this.elements.shift();
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
}

module.exports = Queue;