// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {actions, iJsonLD} from '../src/sections/ld-json'
import * as MockData from './mock-data.test'

// Jest imports
import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

describe(`codeInjector() mocking 'document.scrips'`, () => {
    beforeEach(() => {
        jest.spyOn(document, 'scripts', 'get').mockImplementation(() => {
            const head = document.createElement('head')
            head.innerHTML = MockData.JavaScriptsArraySample.reduce(
                (scriptsString, item) => (scriptsString += `<script type='${item.type}'>${item.text}</script>`),
                ''
            )
            return head.querySelectorAll('script') as any as HTMLCollectionOf<HTMLScriptElement>
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('codeInjector() correctly process JS scrips', () => {
        const data = actions.codeInjector()
        expect(data).toBeArray()
        expect(JSON.stringify(data[0])).toBe(MockData.LdJsonStringSample)
    })
})

describe('codeInjector() mocking the func', () => {
    beforeEach(() => jest.spyOn(actions, 'codeInjector').mockImplementation(() => [MockData.LdJsonSample]))

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('codeInjector() returns valid script(s)', async () => {
        const data = actions.codeInjector()
        expect(data).toBeArray()
        expect(data[0]).toBeObject()
        expect(actions.codeInjector).toBeCalledTimes(1)
    })

    test('reportGenerator() generates valid HTML from complex LD+JSON', () =>
        actions.reportGenerator(MockData.UrlSample, actions.codeInjector(), MockData.reportTester))

    test('reportGenerator() generates valid HTML from empty Url', () =>
        actions.reportGenerator('', actions.codeInjector(), MockData.reportTester))
})

describe('reportGenerator()', () => {
    test('reportGenerator() LD-JSON testing report', () =>
        actions.reportGenerator(MockData.UrlSample, [MockData.LdJsonSample], MockData.reportTester))

    test('reportGenerator() generates valid HTML from empty LD+JSON', () =>
        actions.reportGenerator(MockData.UrlSample, [], MockData.reportTester))

    test('reportGenerator() generates valid HTML from empty Url and empty LD+JSON', () =>
        actions.reportGenerator('', [], MockData.reportTester))
})
