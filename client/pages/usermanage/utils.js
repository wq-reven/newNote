import moment from 'moment';

export const enums = {};

export const dataTypes = {
    orderNumber: 'InputNumber',

    id: 'InputNumber',

    nickName: 'Input',

    followNum: 'InputNumber',

    fansNum: 'InputNumber',

    likeNum: 'InputNumber',

    producedVideoNum: 'InputNumber',

    registerTime: 'DatePicker',

    operation: 'Input',

    sex: 'sex',
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
        return moment(Number(values)).format('YYYY-MM-DD');
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

export const splitBirth = birthday => {
    if ( birthday ) {
        return birthday.split('-')[0];
    } else {
        return '暂无';
    }
}
