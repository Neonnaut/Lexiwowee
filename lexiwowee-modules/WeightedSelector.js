class WeightedSelector {
    keys;
    weights;
    sum;
    constructor(dic) {
        this.keys = [];
        this.weights = [];
        for (const [key, weight] of dic) {
            if (typeof weight == 'number') {
                this.keys.push(key);
                this.weights.push(weight);
            }
        }
        this.sum = this.weights.reduce((a, b) => a + b, 0);
    }
    select() {
        const pick = Math.random() * this.sum;
        let temp = 0;
        for (let i = 0; i < this.keys.length; ++i) {
            temp += this.weights[i];
            if (pick < temp) {
                return this.keys[i];
            }
        }
        throw new Error('failed to choose options from '
            + `'${this.keys.join("', '")}'.`);
    }
}

export default WeightedSelector;