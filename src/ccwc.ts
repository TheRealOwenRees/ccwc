import fs = require('node:fs');

export const readText = (fileName: any) => {
    try {
        return fs.readFileSync(fileName, 'utf-8')
    } catch (err: any) {
        return process.stderr.write(err.message)
    }
}

export const bytesCount = (str: any) => new Blob([str]).size;

export const newLinesCount = (str: any) => [...str.matchAll(/\n/g)].length;

export const charactersCount = (str: any) => str.length

export const wordsCount = (str: any) => {
    const words = str.match(/\S+/g)
    return words ? words.length : 0;
}

const parseFlags = (args: any, str: string) => {
    switch (true) {
        case args.indexOf('-c') > -1:
            return bytesCount(str)
        case args.indexOf('-l') > -1:
            return newLinesCount(str)
        case args.indexOf('-w') > -1:
            return wordsCount(str)
        case args.indexOf('-m') > -1:
            return charactersCount(str)
        default:
            return [newLinesCount(str), wordsCount(str), bytesCount(str)]
    }
}


export const main = (args: string[]) => {
    const argsLength = args.length
    let str = ''

    // TODO process.stdin if exists will be the string
    if (argsLength > 2) str += readText(args[argsLength - 1])
    if (argsLength > 4) return "Too many arguments"


    const results = parseFlags(args, str)

    return typeof results === 'object'
        ? `${results.join(' ')} ${args[argsLength - 1]}`
        : `${results} ${args[argsLength - 1]}`
}

process.stdout.write(main(process.argv));
