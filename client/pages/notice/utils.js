import moment from 'moment';

export const enums = {
    type: [
        { label: '官方公告', value: 2 },
        { label: '新用户推送', value: 1 }
    ],
};

export const dataTypes = {
    mid: 'InputNumber',

    content: 'Input',

    type: 'Select',

    startTime: 'DatePicker',

    endTime: 'DatePicker',

    createTime: 'DatePicker',
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
        if (values != 0) {
            return moment(values).format('YYYY-MM-DD HH:mm');
        }
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
    wrapperCol: { span: 14 },
};
