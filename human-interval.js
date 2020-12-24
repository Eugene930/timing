// https://github.com/agenda/human-interval/blob/master/index.js

const units = {};
units.second = 1000;
units.minute = units.second * 60;
units.hour = units.minute * 60;
units.day = units.hour * 24;
units.week = units.day * 7;
units.month = units.day * 30;
units.year = units.day * 365;

const regexp = /(second|minute|hour|day|week|month|year)s?/;

const humanInterval = time => {
    if (!time || typeof time === 'number') {
        return time
    }
    
    let result = Number.NaN

    time = time.replace(/([^a-z\d.-]|and)+/g, ' ');
    
    for (;;) {
        const match = time.match(regexp)
        if (!match) {
            return result
        }
        
        const machedNumber = time.slice(0, match.index).trim()
        const unit = units[match[1]]
        let number = 1;
        if (machedNumber.length !== 0) {
            number = Number.parseFloat(machedNumber)
        }
        
        if (Number.isNaN(result)) {
            result = 0
        }
        
        result += number * unit
        time = time.slice(match.index + match[0].length)
    }
}

export default humanInterval