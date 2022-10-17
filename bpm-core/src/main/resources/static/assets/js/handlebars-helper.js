  

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
            break;
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
            break;
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
            break;
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            break;
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
            break;
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            break;
        default:
            return options.inverse(this);
            break;
    }
});

Handlebars.registerHelper("inc", function (value, options) {
    return parseInt(value) + 1;
});
Handlebars.registerHelper("relation", function (value, options) {
    if (!value) {
        return '';
    }
    return value === 'is' ? '是' : value === 'exist' ? '存在' : value == 'nothingness' ? '不存在' : value === '==' ? '等于' : value === '!=' ? '不等于' : value === '>=' ? '大于等于' : value === '<=' ? '小于等于' : value === '>' ? '大于' : value === '<' ? '小于' : value === 'include' ? '包含' : value === 'exclude' ? '不包含' : '';
});