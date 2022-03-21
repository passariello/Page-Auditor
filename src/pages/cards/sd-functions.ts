// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {MustBeUniqueOccurrences} from './sd'
import {Card, CardKind} from 'Components/cards/card'
import {Mode} from 'Components/colorCode/component'
import {disposableId} from 'Root/main'
import {Report} from 'Components/report/component'
import {Schema} from 'Components/schema/component'
import * as CardBlocks from 'Components/cards/card-blocks'
import * as Tips from 'Pages/tips/tips'
import * as Errors from './errors'
import * as Icons from 'Components/icons/component'

//import 'Assets/logos/_noRendering_400x200.png'

const schemaTypesWithMustBeUniqueOccurrences: string[] = ['Organization', 'WebSite', 'BreadcrumbList']

export const ldJsonCard = (schema: Schema, tabUrl: string, occurrences: MustBeUniqueOccurrences, report: Report) => {
    if (schema.isEmpty()) {
        const card = Errors.sd_IsEmpty(tabUrl)
        report.addCard(card)
        Tips.StructuredData.noStructuredData(card)
    }
    let schemaType = Schema.getType(schema.getJson())
    Schema.resetDictionary()

    const scriptId = disposableId()
    const structuredDataDescription = `Structured Data communicates content (data) to the Search Engines in an organized manner so they can display the content in the SERPs in an attractive manner.`
    const card = new Card(CardKind.report)
        .open(`Structured Data`, Schema.flattenName(schemaType), 'icon-ld-json')
        .add(CardBlocks.paragraph(structuredDataDescription))
        .add(CardBlocks.paragraph(schema.schemaToHtml()))
        .add(
            CardBlocks.expandable(
                'JSON-LD Code',
                CardBlocks.code(schema.getCodeAsString(), Mode.json, scriptId),
                Icons.code,
                `box-code`
            )
        )
        .setTag('card-ok')

    Schema.enableOpenClose(card.getDiv())

    if (schema.getRelativeUrls().length > 0) {
        Tips.StructuredData.avoidRelativeUrls(
            Promise.resolve(card),
            Schema.flattenName(schemaType),
            schema.getRelativeUrls(),
            tabUrl
        )
    }

    schemaTypesWithMustBeUniqueOccurrences
        .filter(schema => schema === schemaType)
        .forEach(schemaType => {
            if (Schema.getSchemaCounter(schemaType) > 1) {
                Tips.StructuredData.repeatedSchemas(card, schemaType, Schema.getSchemaCounter(schemaType))
            }
        })

    return card
}
