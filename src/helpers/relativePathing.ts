import { join, posix } from 'node:path';

export const fromSrc = (path: string): string => {
    return join(__dirname, '..', path);
};

export const fromRoot = (path: string): string => {
    return join(__dirname, '..', '..', path);
};






export const getRelativePath = ( fromDirPath: string, toDirName: string) =>  {

    if(fromDirPath === null) {
        throw new Error('fromDirPath not defined.');
    }

    if (toDirName === null) {
        throw new Error('toDirName not defined.');
    }





    // return relative(fromDirPath, toDirName).replace(/\\/g, '/').concat('/');
    return posix.relative(fromDirPath, toDirName); //.concat('/');


};



//  removeFirstDot(txt: string): string {
//     return txt.replace(/^\./, '');
// }
