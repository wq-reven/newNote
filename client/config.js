// 这里主要是对host进行定义，
let localInterfaceHost;
if (process.env.NODE_ENV === 'development') {
    localInterfaceHost = 'http://' + LOCATIONIP + ':3005/';
    console.log(localInterfaceHost);
}
// localInterfaceHost = 'http://localhost:9100/project/api/microlive_management/';
localInterfaceHost = '//nyx.staff.ifeng.com/project/api/microlive_management/';
const apiInterfaceHost = '';

export const APIHOST = localInterfaceHost;
