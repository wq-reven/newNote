import moment from 'moment';

export const enums = {
    permission: [
        { label: '无权限', value: 0 },
        { label: '有权限', value: 1 },
    ],
    roles: [
        { label: '普通管理员', value: 1},
        { label: '超级管理员', value: 2},
    ],
};

export const dataTypes = {
    uid: 'InputNumber',

    nickname: 'Input',

    permission: 'InputNumber',

    roles: 'Select',
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
        return moment(values).format('YYYY-MM-DD');
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
