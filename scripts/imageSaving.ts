const fetch = require('node-fetch');
const {writeFile} = require('fs');
const {promisify} = require('util');
const writeFilePromise = promisify(writeFile);

// thx to https://stackoverflow.com/a/53939575 whole file in memory buffer
// but 200kb file not bad
export const downloadFile = (url, outputPath) => {
    return fetch(url)
        .then(x => x.arrayBuffer())
        .then(x => writeFilePromise(outputPath, Buffer.from(x)));
}
