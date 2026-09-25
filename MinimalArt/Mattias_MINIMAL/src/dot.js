export class myDot {
    constructor(p,x,y){
        this.p = p;
        this.x = x;
        this.y = y;
        this.turnCount = 0;
    }
    display(){
        this.p.fill(0);
        this.p.point(this.x,this.y);
    };

    hello(){
        console.log("Hello world");
    }
}