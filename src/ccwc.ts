import fs = require('node:fs');

export const readText = (fileName: string | undefined): string => {
    if (typeof fileName !== 'undefined') {
        try {
            return fs.readFileSync(fileName, 'utf-8')
        } catch {
            throw new Error("There was a problem reading the file")
        }
    } else {
        throw new Error("No file")
    }
}

export const readStdIn = () => {
    let input = ''
    process.stdin.setEncoding('utf-8')

    return new Promise<string>((resolve) => {
        process.stdin.on('readable', () => {
            const chunk = process.stdin.read()
            if (chunk !== null) {
                input += chunk
            }
        })

        process.stdin.on('end', () => {
            resolve(input)
        })
    })
}

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

export const main = (args: string[]) => {
    const flags = ['-c', '-l', '-w', '-m']
    const argsLength = args.length

    try {
        let filename = ''
        let str = ''

        if (argsLength > 4) throw new Error("Too many arguments")

        if (argsLength > 3) {
            filename = args.at(-1) ?? ''
            str += readText(args.at(-1))
        }

        if (argsLength <= 3) {
            if (flags.indexOf(String(args.at(-1))) != -1) {
                str += readStdIn()
            } else {
                str += readText(args.at(-1))
            }
        }

        const results = parseFlags(args, str)

        return Array.isArray(results)
            ? `${results.join(' ')} ${args.at(-1)}`
            : `${results} ${filename}`
    } catch (error: any) {
        return (error.message)
    }
}

const result = main(process.argv);
process.stdout.write(`${result}\n`)
