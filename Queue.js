export class Queue {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    /**
     * Enqueued 70 to give [70]
     * Enqueued 20 to give [70, 20]
     * Enqueued 40 to give [70, 20, 40]
     * 40 is tail, 70 is head
     
     * [20, 30, 20, 70, 20, 20, 80, 90]
     * Dequeued 20 to give [30, 20, 70, 20, 20, 80, 90]
     * Dequeued 30 to give [20, 70, 20, 20, 80, 90]
     * thank u stackoverflow
     * next -> <- prev
     * first in, first out
     */

    enqueue(newNode) {
        if(!this.tail) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;   
        }
    }

    // remove from head
    dequeue() {
        if(!this.head) {
            console.log('Queue is empty')
            return;
        } else if(this.head.next) {
            this.head = this.head.next;
            this.head.prev = null;
        } else {
            this.head = null;
            this.tail = null;
        }
    }


    peek() {
        return this.head;
    }

    getTheList() {
        let head = this.peek();
        while(head) {
            console.log(head)
            head = head.next;
        }
    }
}