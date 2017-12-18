import moment from 'moment';

export const enums = {
    status: [
        { label: '下线', value: "0" },
        { label: '上线', value: "1" },
        { label: '未审核', value: "2" },
        { label: '处理中', value: "3" },
        { label: '出错', value: "4" },
        { label: '审核未通过', value: "5" },
        { label: '已删除', value: "6" },
    ],
};

export const dataTypes = {
    vid: 'InputNumber',

    title: 'Input',

    musicUrl: 'Input',

    challengeName: 'Input',

    uid: 'Input',

    nickname: 'Input',

    publishTime: 'DatePicker',

    source: 'Input',

    cpName: 'Input',

    insertTime: 'DatePicker',

    playCount: 'InputNumber',

    likeCount: 'InputNumber',

    status: 'Select',

    VideoPlayUrl: 'Input',
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
        if ( values != 0) {
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
