const program = require('commander');
const fs = require('fs');
const { resolve } = require('path');

const createRelativePath = path => {
    return path.split('/').map(() => '..').slice(1).join('/');
};
program
    .option('-p, --path [type]', '创建的模块路径')
    .option('-t, --type [type]', '创建的模块的类型', 'curd')
    .option('-f, --force', '是否强制更新')
    .parse(process.argv);

const checkPath = (path, isForceCreate) => {
    if (typeof path === 'undefined') {
        console.error('path必须填写');
        return false;
    }
    path = resolve(process.cwd(), path);
    const urlSchema = resolve(path, 'schema.json');
    const urlConfig = resolve(path, 'config.json');
    const urlModels = resolve(path, 'models.js');
    if (fs.existsSync(path)) {
        if (!isForceCreate && fs.existsSync(urlModels)) {
            console.error('该目录已经有相关文件了，如果要覆盖，请加上参数 --force');
            return false;
        }
        if (fs.existsSync(urlSchema) && fs.existsSync(urlConfig)) {
            return true;
        } else {
            console.error('目录中缺少 schema.json 或者 config.json，请添加后重试');
            return false;
        }
    } else {
        console.error('目录不存在');
        return false;
    }
};

if (checkPath(program.path, program.force)) {
    const path = resolve(process.cwd(), program.path);
    const schema = require(resolve(path, 'schema.json'));
    const config = require(resolve(path, 'config.json'));
    const command = require(`./commands/${program.type}`);
    command.create(schema, Object.assign({}, config, {path: program.path, relativePath: createRelativePath(program.path)}) );
} else {
    process.exit();
}
