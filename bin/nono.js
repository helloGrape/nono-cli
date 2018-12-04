#!/usr/bin/env node

// console.log('nono is run!')

// console.log('nono changes optionally')

const program = require('commander');
program
.usage('<command> [项目名称]')
.version('1.0.3', '-v, --version')
.command('init', '初始化项目')
.parse(process.argv)