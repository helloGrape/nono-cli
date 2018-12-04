const fs = require('fs')

function isExistFile ( dir ) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync (dir)) {
            console.log('存在该路径: ', dir);
            resolve('exist')
        }else {
            reject('not exist')
        }
    })
}

function isFileDirectory ( dir ) {
    return new Promise((resolve, reject) => {
        fs.stat(dir, (err, stat) => {
            if (stat.isDirectory()) {
                resolve('directory')
            }else {
                reject('not a directory')
            }
        })
    })
}

function isExistDirectory (dir) {
    return isExistFile(dir).then(() => {
        return isFileDirectory (dir)
    })
}

module.exports = {
    isExistDirectory
}