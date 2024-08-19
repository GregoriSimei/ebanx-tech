import { describe, expect, test } from 'vitest'
import { ErrorCustom } from './ErrorCustom'

function testToThrowError() {
    throw new Error('test')
}

describe('ErrorCustom', () => {
    test('when throw some error of the type Error should return the fileName and functionName where the error occurs', () => {
        let throwSomeError: boolean = false

        try {
            testToThrowError()
        } catch (e) {
            throwSomeError = true
            if (e instanceof Error) {
                const errorHandled = new ErrorCustom({ error: e })

                const fileName = errorHandled.getFileName() // should be the actual file (__filename)
                const functionName = errorHandled.getFunctionName() // should be 'testToThrowError'

                expect(fileName).toBe(__filename)
                expect(functionName).toBe('testToThrowError')
            }
        }

        expect(throwSomeError).toBeTruthy()
    })
})