export const uniqueName = function() {
    const now = Date.now();
    return '' + ( parseFloat(now) * Math.ceil(Math.random() * 19));
}

const renamer = function (fileName) {
    fileName = fileName.split('.');

    if (fileName.length === 1) {
        return uniqueName();
    }

    return `${uniqueName()}.${fileName[fileName.length -1]}`;
}

export default renamer;