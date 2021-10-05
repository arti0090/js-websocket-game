const SingleShot = require('./weapons/SingleShot');
const DoubleShot = require('./weapons/DoubleShot');
const TripleShot = require('./weapons/TripleShot');
const QuadShot = require('./weapons/QuadShot');

module.exports = {
    getRandomInt: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    },

    getRandomColor: function(){
        return `rgb(${this.getRandomInt(0, 255)}, ${this.getRandomInt(0, 255)}, ${this.getRandomInt(0, 255)})`;
    },

    getRandomWeapon: function() {
        let items = [new SingleShot(), new DoubleShot(), new TripleShot(), new QuadShot()];

        return items[Math.floor(Math.random()*items.length)];
    }
}
