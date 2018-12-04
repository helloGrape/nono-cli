#!/usr/bin/env node

// console.log('nono init.')

const program = require('commander');
const path = require('path');
const inquirer = require('inquirer');
const ora = require('ora');
const fs = require('fs');
const exec = require('child_process').exec;
const { isExistDirectory } = require('../lib/file');
const { templateUrls } = require('../config/nono.defalut.config');
const { downloadTemplate } = require('../lib/download');

let spinner = null;

program
.usage('<project-name>')
.parse(process.argv)

const projectName = program.args[0];
// console.log('first parameter: ', projectName)

if(!projectName) {
    // console.log('help')
    program.help();
}else {
    const processDir = process.cwd(); // 当前进程执行目录
    const createDir = path.resolve(processDir, projectName); // path 从右到左依次处理，直到构造出绝对路径。
    isExistDirectory(createDir)
    .then(() => {
        console.log(`该项目${projectName}已存在`)
    })
    .catch(() => {
        console.log(`开始创建...`);
        inquirer.prompt([
            {
                type: 'list',
                name: 'template',
                message: '请选择模板',
                choices: Object.keys(templateUrls)
            }
        ])
        .then((answers) => {
            // console.log('answers: ', answers);
            const type = answers.template;
            const templateUrl = templateUrls[type];
            spinner = ora(`开始下载模板，模板地址： ${templateUrl}`);
            spinner.start();
            return downloadTemplate(projectName, templateUrl);
        })
        .then(() => {
            spinner.succeed('模板下载完成，开始配置配置文件');
            spinner.stop();
            return editPackageJson(createDir, projectName);
        })
        .then(() => {
            return confirmNpmInstall();
        })
        .then((isInstall) => {
            if(isInstall) {
                spinner = ora('开始安装依赖...');
                spinner.start();
                return npmInstall(createDir);
            }else {
                return '初始化项目完成。'
            }
        })
        .then((str) => {
            if (str) {
                ora(str).succeed();
            }else {
                spinner.succeed('初始化项目完成。')
                spinner.stop();
            }
            // ora().fail('33333')
        })
        .catch(err => {
            ora().fail(err)
        })
    })
}

function editPackageJson(dir, projectName) {
    const pkgPath = path.join(dir, 'package.json');
    const defaultPkg = require(pkgPath);
    // console.log('defaultPkg: ', defaultPkg);

    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                name: 'name',
                message: '请输入项目名称',
                default: projectName
            },
            {
                name: 'version',
                message: '请输入项目版本',
                default: '1.0.0'
            },
            {
                name: 'description',
                message: '请输入项目描述',
                default: ''
            }
        ])
        .then(answers => {
            // console.log('answer: ', answers)
            const userPkg = Object.assign(defaultPkg, answers);
            fs.writeFileSync(pkgPath, JSON.stringify(userPkg, null, '  '));
            resolve();
        })
    })
}

function confirmNpmInstall() {
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                type: 'confirm',
                name: 'install',
                message: '是否安装依赖',
                default: true
            }
        ]).then(answers => {
            // console.log('answers: ', answers);
            resolve(answers.install);
        })
    })
}

function npmInstall(dir) {
    return new Promise((resolve, reject) => {
        exec(`cd ${dir} && npm install`, (err, stdout, stderr) => {
            if (err) {
                console.log('stderr: ', stderr);
                reject(err)
            }else {
                // console.log('stdout: ', stdout);
                resolve()
            }
        })
    })
}