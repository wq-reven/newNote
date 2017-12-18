const ejs = require('ejs');
const prettier = require('prettier');
const fs = require('fs');
const { resolve } = require('path');

const getRules = item => {
    let result = {};
    switch (item.type) {
        case 'string':
            if (item.maxLength) {
                result.max = item.maxLength;
            }
            if (item.minLength) {
                result.min = item.minLength;
            }
            break;
        case 'boolean':
            break;
        case 'number':
        case 'integer':
            let sMax = 'true';
            let sMin = 'true';
            if (typeof item.minimum !== 'undefined' && typeof item.maximum !== 'undefined') {
                const markMax = item.exclusiveMaximum ? '<=' : '<';
                sMax = `value ${markMax} ${item.maximum}`;
                const markMin = item.exclusiveMinimum ? '>=' : '>';
                sMin = `value ${markMin} ${item.minimum}`;
                result.validator = new Function(
                    'rule',
                    'value',
                    'callback',
                    `if(${sMax} && ${sMin}){callback();}else{callback('值要大于 ${item.minimum} 并且小于 ${item.maximum}');}`
                ).toString();
            } else if (typeof item.maximum !== 'undefined') {
                const mark = item.exclusiveMaximum ? '<=' : '<';
                sMax = `value ${mark} ${item.maximum}`;
                result.validator = new Function(
                    'rule',
                    'value',
                    'callback',
                    `if(${sMax}){callback();}else{callback('值要小于 ${item.maximum}');}`
                ).toString();
            } else if (typeof item.minimum !== 'undefined') {
                const mark = item.exclusiveMinimum ? '>=' : '>';
                sMin = `value ${mark} ${item.minimum}`;
                result.validator = new Function(
                    'rule',
                    'value',
                    'callback',
                    `if(${sMin}){callback();}else{callback('值要大于 ${item.minimum}');}`
                ).toString();
            }
            break;
        default:
            break;
    }
    if (item.pattern) {
        result.pattern = item.pattern;
    }
    return result;
};

const getType = item => {
    if (item.$uiControl) {
        return item.$uiControl;
    }

    if (item.enum) {
        return 'Select';
    }

    if (item.type === 'string') {
        return 'Input';
    }

    if (item.type === 'integer' || item.type === 'number') {
        return 'InputNumber';
    }
};

const createConfig = schema => {
    let result = [];
    const list = schema.properties.data.properties.list.items.properties;
    const requires = schema.properties.data.properties.list.items.required || [];
    for (let key of Object.keys(list)) {
        let item = list[key];
        // 对数组进行特殊处理，这里的数组只是代表当前字段为多选，并不会有下一级的字段集合
        // 当前代码不对此种情况进行处理。
        if (item.type === 'array') {
            let temp = { ...item.items };
            item = { ...item, ...temp, id: item.id };
        }
        let resultItem = {
            name: item.id.split('/')[item.id.split('/').length - 1],
            title: item.title,
            type: item.type,
            isSort: item.$uiIsSort ? true : false,
            rules: {
                require: requires.includes(key),
                ...getRules(item),
            },
        };
        if (item.enum) {
            resultItem.enum = item.enum;
        }
        if (item.$uiEnum) {
            resultItem.$uiEnum = item.$uiEnum;
        }
        if (item.type === 'boolean' && !item.$uiEnum) {
            resultItem.$uiEnum = [{ value: true, label: '是' }, { value: false, label: '否' }];
        }
        resultItem.$uiControl = getType(item);
        result.push(resultItem);
    }
    return result;
};

// const data = {
//     list: [
//         {
//             name: 'id',
//             title: 'id',
//             type: 'string',
//             rules: {
//                 require: true,
//             },
//         },
//         {
//             name: 'name',
//             title: '书名',
//             type: 'string',
//             rules: {
//                 require: true,
//             },
//         },
//         {
//             name: 'age',
//             title: '价格',
//             type: 'integer',
//             rules: {
//                 require: true,
//             },
//         },
//         {
//             name: 'sex',
//             title: '分类',
//             type: 'integer',
//             enum: [1, 2, 3],
//             rules: {
//                 require: true,
//             },
//         },
//         {
//             name: 'birthday',
//             title: '出版日期',
//             type: 'integer',
//             rules: {
//                 require: true,
//             },
//             extendType: 'date',
//         },
//     ],
//     stateKey: 'books',
//     path: 'app/pages/books',
//     apis: {
//         get: 'bookslist',
//         del: 'booksdel',
//         update: 'booksupdate',
//         add: 'booksadd',
//     },
// };

// data.list = createConfig(schema);

// console.log(JSON.stringify(createConfig(schema)));

const prettierOption = {
    tabWidth: 4,
    singleQuote: true,
    trailingComma: 'all',
    jsxBracketSameLine: true,
    printWidth: 120,
};

const templatePath = resolve(process.cwd(), 'templete/templetes/curd/');

const ejsFiles = [
    {
        input: 'add.ejs',
        output: 'add.jsx',
    },
    {
        input: 'addPlus.ejs',
        output: 'addPlus.jsx',
    },
    {
        input: 'edit.ejs',
        output: 'edit.jsx',
    },
    {
        input: 'list.ejs',
        output: 'list.jsx',
    },
    {
        input: 'search.ejs',
        output: 'search.jsx',
    },
    {
        input: 'view.ejs',
        output: 'view.jsx',
    },
    {
        input: 'models.ejs',
        output: 'models.js',
    },
    {
        input: 'utils.ejs',
        output: 'utils.js',
    },
];

const copyFiles = ['index.js', 'addPlus.css', 'search.css'];

const createEjs = (files, data, templatePath) => {
    const outputPath = resolve(process.cwd(), data.path);
    // console.log(outputPath);
    for (let item of files) {
        // console.log(resolve(outputPath, item.output));
        ejs.renderFile(resolve(templatePath, item.input), data, function(err, str) {
            if (!err) {
                const data = new Buffer(prettier.format(str, prettierOption));
                fs.writeFile(resolve(outputPath, item.output), data, function(err) {
                    if (!err) {
                        console.log(item.output, '文件生成成功');
                    }
                });
            } else {
                console.log(err);
            }
        });
    }
};

const copyFile = (files, config, templatePath) => {
    const outputPath = resolve(process.cwd(), config.path);
    for (let src of files) {
        fs.writeFileSync(resolve(outputPath, src), fs.readFileSync(resolve(templatePath, src)));
        console.log(src, '文件复制成功');
    }
};

exports.create = (schema, config) => {
    config.list = createConfig(schema);
    console.log(JSON.stringify(config));
    createEjs(ejsFiles, config, templatePath);
    copyFile(copyFiles, config, templatePath);
};
