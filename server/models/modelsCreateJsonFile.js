const fs = require('fs');
const {jsonFileDirectory} = require("../config/config")


function createJsonFile(data,fileName){
    fs.writeFile(`${jsonFileDirectory}/${fileName}`, data, 'utf8', function (error) {
        if(error) console.error(error)
        console.log('write end')
    });
}

module.exports = createJsonFile;

