// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Schema} from '../src/schema'
import * as MockData from './mock-data.test'

// Jest imports
import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

// test('SchemaLinks() generates proper links', async () => {
//     const data = Schema.schemaLinks('Graph', 'https://mydomain.com/homepage.htm')
//     expect(data).toBeArray()
//     expect(data.length).toBe(3)
//     data.forEach(btn => {
//         expect(btn.url.match(MockData.RegExIsUrl)).toBeArray()
//     })
// })

// test('ldJsonCard() creates card with proper HTML', () => {
//     const data = ldJsonCard(MockData.LdJsonSample, MockData.UrlSample).getDiv().innerHTML
//     expect(data).toBeString().toHTMLValidate()
// })
