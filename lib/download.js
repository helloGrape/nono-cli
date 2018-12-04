
const exec = require('child_process').exec;  // 创建子进程

function downloadTemplate(dir, url) {
    const gitCmd = `git clone ${url} ${dir}`;

    return new Promise((resolve, reject) => {
        exec(gitCmd, (err, stdout, stderr) => {
            if(err) {
                console.log('stderr: ', stderr)
                reject(err)
            }else {
                console.log('stdout: ', stdout)
                resolve()
            }
        })
    })
}

module.exports = {
    downloadTemplate
}