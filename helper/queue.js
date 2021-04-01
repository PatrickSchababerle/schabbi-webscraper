class Queue {
    constructor(){
        this.elements = [];
    }
    enqueue(e){
        this.elements.push(e);
    }
    dequeue() {
        return this.elements.shift();
    }
    isEmpty() {
        return this.elements.length == 0;
    }
    peek() {
        return !this.isEmpty() ? this.elements[0] : undefined;
    }
    length() {
        return this.elements.length;
    }
    contained(e) {
        return (this.elements.indexOf(e) > -1);
    }
    list() {
        return this.elements;
    }
}

module.exports = Queue;