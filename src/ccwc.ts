import fs from "node:fs/promises";

export const readText = async (fileName: string | undefined): Promise<string> => {
    if (typeof fileName !== 'undefined') {
        try {
            return await fs.readFile(fileName, {encoding: 'utf-8'})
        } catch {
            throw new Error("There was a problem reading the file")
        }
    } else {
        throw new Error("No file")
    }
}

export const readStdIn = async () => {
    let input = ''

    process.stdin.setEncoding('utf-8')

    for await (const chunk of process.stdin) {
        input += chunk
    }

    return input
};

export const bytesCount = (str: string) => Buffer.byteLength(str, 'utf-8')

export const newLinesCount = (str: string) => [...str.matchAll(/\n/g)].length;

export const charactersCount = (str: string) => str.length

export const wordsCount = (str: string) => {
    const words = str.match(/\S+/g)
    return words ? words.length : 0;
}

const parseFlags = (args: string[], str: string) => {
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

export const main = async (args: string[]) => {
    const argsLength = args.length

    try {
        const filenameRegex = /[^\-].*\.(txt|js|ts)$/
        let filename = ''
        let str = ''
        let isPiped = false

        if (!process.stdin.isTTY) {
            str += await readStdIn()
            isPiped = true
        } else {
            switch (true) {
                case argsLength > 4:
                    throw new Error("Too many arguments")
                case argsLength === 3 || argsLength === 4:
                    if (filenameRegex.test(args[2]) && !args[2].startsWith('-')) {
                        filename = args[2]
                    } else if (argsLength === 4 && filenameRegex.test(args[3]) && !args[3].startsWith('-')) {
                        filename = args[3]
                    }
                    if (filename) {
                        str += await readText(filename)
                    }
                    break
                default:
                    throw new Error("An error occurred, likely not enough arguments or invalid flags provided")
            }
        }

        const results = parseFlags(args, str)

        return Array.isArray(results)
            ? `${results.join(' ')} ${isPiped ? '' : args.at(-1)}`
            : `${results} ${filename}`
    } catch (error: any) {
        return (error.message)
    }
}

process.stdout.write(`${await main(process.argv)}\n`)