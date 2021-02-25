module.exports = {
    chunkNumber: function (number, n) {
        return new Array(Math.floor(number / n)).fill(n).concat(number % n);
    },
    chunkArray: function (array, size) {
        const chunked_arr = [];
        let index = 0;
        while (index < array.length) {
            chunked_arr.push(array.slice(index, size + index));
            index += size;
        }
        return chunked_arr;
    }
}