export class TrafficLight {
    constructor(road) {
        this.road = road
        this.state = 'red'
    }
    
    setGreen() {this.state = 'green'}
    setRed() {this.state = 'red'}
    isGreen() {return this.state == 'green'}
}