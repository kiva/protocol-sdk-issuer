const fs = require('fs');
const imageDirectoryPath = __dirname + '/../../public/images/';
const directoryObj = fs.readdirSync(imageDirectoryPath);
const imageData = supplyImages(supplyImageList(imageDirectoryPath, directoryObj, []));

for (let fileName in imageData) {
    fs.writeFileSync(__dirname + '/../../src/assets/images/' + fileName + '.ts', 'const ' + fileName + ': string = "' + imageData[fileName] + '"; export default ' + fileName + ';', 'utf8');
}

function supplyImages(fileArray) {
    const ret = {};

    fileArray.forEach(img => {
        let imgName = generateFileName(img),
            encoded = createBase64(img);
        if (encoded) {
            ret[imgName] = generateBase64Prefix(img) + encoded;
        }
    });

    return ret;
}

function supplyImageList(path, dir, list) {
    let fileNumber = dir.length;

    for (let i = 0; i < fileNumber; i++) {
        if (dir[i].indexOf('.') === 0) {
            continue;
        }
        let name = path + dir[i],
            stat = fs.statSync(name);

        if (stat.isDirectory()) {
            let d = fs.readdirSync(name);
            supplyImageList(name + '/', d, list);
        } else {
            list.push(name);
        }
    }

    return list;
}

function createBase64(fileName) {
    let fileData = fs.readFileSync(fileName),
        base64String = false;

    if (fileData) {
        base64String = Buffer.from(fileData).toString('base64');
    }
    return base64String;
}

function lop(str, char) {
    return str.slice(str.lastIndexOf(char) + 1);
}

function generateFileName(path) {
    const startFrom = imageDirectoryPath.length;
    return path.substring(startFrom, path.lastIndexOf('.')).replace('/', '_');
}

function generateBase64Prefix(fileName) {
    return "data:image/" + lop(fileName, '.') + ";base64,";
}