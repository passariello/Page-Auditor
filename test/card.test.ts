// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, CardKind} from '../src/card'
import * as CardBlocks from '../src/card-blocks'

// Jest imports
import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

// test('Card, without category and link, generates valid HTML', () => {
//     const title = 'Testing Card class'
//     const preTitle = ''
//     const cssClass = 'any-class'
//     const body = '<div>valid HTML fragment</div>'
//     const links = [] as iLink[]
//     const htmlCode = new Card().open(preTitle, title, links, cssClass).addParagraph(body).getDiv().innerHTML
//     expect(htmlCode)
//         .toBeString()
//         .toContain(
//             `<h2 class="cardTitle ${cssClass}">` +
//                 `<div class="cardPreTitle">${preTitle}</div>` +
//                 `${title}` +
//                 `<div class="card-toolbar"></div>` +
//                 `</h2>`
//         )
//         .toContain(body)
//         .toHTMLValidate()
// })

// test('Card, with category, generates valid HTML', () => {
//     const title = 'Testing Card class'
//     const preTitle = 'Any PreTitle'
//     const cssClass = 'any-class'
//     const body = '<div>valid HTML fragment</div>'
//     const links = [{url: 'https://www.mydomain.com/', label: 'website'}] as iLink[]
//     const htmlCode = new Card().open(preTitle, title, links, cssClass).addParagraph(body).getDiv().innerHTML

//     expect(htmlCode)
//         .toBeString()
//         .toContain(
//             `<h2 class="cardTitle ${cssClass}">` +
//                 `<div class="cardPreTitle">${preTitle}</div>` +
//                 `${title}` +
//                 `<div class="card-toolbar"><a href="${links[0].url}" target="_blank">${links[0].label}</a></div>` +
//                 `</h2>`
//         )
//         .toContain(body)
//         .toHTMLValidate()
// })

// test('Card, calling .add() with an empty string, generates valid HTML', () => {
//     const title = 'Testing Card class'
//     const preTitle = 'Any PreTitle'
//     const cssClass = 'any-class'
//     const body = ''
//     const links = [{url: 'https://www.mydomain.com/', label: 'website'}] as iLink[]
//     const data = new Card().open(preTitle, title, links, cssClass).addParagraph(body).getDiv().innerHTML
//     expect(data).toBeString().toHTMLValidate()
// })

test('Error Card generates valid HTML', () => {
    const msg = '<div>Some error description</div>'
    const data = new Card(CardKind.error).add(CardBlocks.paragraph(msg)).getDiv().innerHTML
    expect(data)
        .toBeString()
        .toContain(
            `<h2 class="cardTitle icon-error">` +
                `<div class="cardPreTitle"></div>` +
                `Error` +
                `<div class="card-toolbar"></div>` +
                `</h2>`
        )
        .toContain(msg)
        .toHTMLValidate()
})

test('Suggestion Card generates valid HTML', () => {
    const msg = '<div>Some suggestion</div>'
    const htmlCode = new Card(CardKind.suggestion).add(CardBlocks.paragraph(msg)).getDiv().innerHTML
    expect(htmlCode)
        .toBeString()
        .toContain(
            `<h2 class="cardTitle icon-suggestion">` +
                `<div class="cardPreTitle"></div>` +
                `Suggestion` +
                `<div class="card-toolbar"></div>` +
                `</h2>`
        )
        .toContain(msg)
        .toHTMLValidate()
})
