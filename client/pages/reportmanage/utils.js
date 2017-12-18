import moment from 'moment';

export const enums = {
    type: [{ label: '视频', value: 1 }, { label: '用户', value: 2 }],
    status: [{ label: '未处理', value: 0 }, { label: '已处理', value: 1}],
};

export const dataTypes = {
    informId: 'InputNumber',

    informedId: 'InputNumber',

    type: 'Select',

    content: 'Select',

    created: 'DatePicker',
};

export const formatViewData = (key, values) => {
    if (enums[key]) {
        let result = [];
        if (typeof values === 'string') {
            values = values.split(',');
        } else if (typeof values === 'number' || typeof values === 'boolean') {
            values = [values];
        }
        for (let value of values) {
            for (let item of enums[key]) {
                if (item.value === value) {
                    result.push(item.label);
                }
            }
        }
        return result.join(',');
    } else if (dataTypes[key] === 'DatePicker') {
        return moment(values).format('YYYY-MM-DD HH:mm');
    } else {
        return values;
    }
};

export const formatFormData = values => {
    let result = {};
    Object.keys(values).forEach(key => {
        if (typeof values[key] !== 'undefined') {
            if (values[key] instanceof moment) {
                result[key] = values[key].valueOf();
            } else {
                result[key] = values[key];
            }
        }
    });
    return result;
};

export const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
};
