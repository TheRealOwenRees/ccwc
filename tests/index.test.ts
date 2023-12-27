import {readText, bytesCount, newLinesCount, wordsCount, charactersCount, main, readStdIn} from "../src/ccwc";

const testFile = readText('./test.txt')

describe('ccwc tests', () => {

    describe('test text parsing', () => {
        it('Text file is read', () => {
            expect(testFile).toEqual(expect.any(String))
        })

        it('Number of bytes in test file', () => {
            const result = bytesCount(testFile)
            expect(result).toEqual(342190)
        })

        it('Number of new lines in test file', () => {
            const result = newLinesCount(testFile)
            expect(result).toEqual(7145)
        })

        it('Number of characters in test file', () => {
            const result = charactersCount(testFile)
            expect(result).toEqual(339292)
        })

        it('Number of words in test file', () => {
            const result = wordsCount(testFile)
            expect(result).toEqual(58164)
        })
    })

    describe('test flags', () => {
        it('-l and test file', () => {
            const result = main(['node', 'src/ccwc.ts', '-l', 'test.txt'])
            expect(result).toBe('7145 test.txt')
        })

        it('-c and test file', () => {
            const result = main(['node', 'src/ccwc.ts', '-c', 'test.txt'])
            expect(result).toBe('342190 test.txt')
        })

        it('-w and test file', () => {
            const result = main(['node', 'src/ccwc.ts', '-w', 'test.txt'])
            expect(result).toBe('58164 test.txt')
        })

        it('-m and test file', () => {
            const result = main(['node', 'src/ccwc.ts', '-m', 'test.txt'])
            expect(result).toBe('339292 test.txt')
        })

        it('no flag and test file', () => {
            const result = main(['node', 'src/ccwc.ts', 'test.txt'])
            expect(result).toBe('7145 58164 342190 test.txt')
        })
    })

    describe('stdin', () => {
        it('stdin test', () => {
            expect(readStdIn()).toBe('test')
        })
    })

    describe('errors', () => {
        it('too many arguments', () => {
            const result = main(['node', 'src/ccwc.ts', '-l', "test.txt", 'extra'])
            expect(result).toBe("Too many arguments")
        })

        it('Test non existent file', () => {
            const result = main(['node', 'src/ccwc.ts', '-l', 'tes']);
            expect(result).toBe('There was a problem reading the file')
        })
    })
})

