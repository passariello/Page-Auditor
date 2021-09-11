// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card} from '../card'
import {sectionActions} from '../main'
import {ldJsonCard} from './ld-json-functions'

export interface iJsonLD {
    [name: string]: string | [] | {}
}

export interface iJsonLevel {
    depth: number
}

const reporter = async (
    tabUrl: string,
    scripts: any
): Promise<string> => {
    const jsonScripts: iJsonLD[] = scripts as iJsonLD[]

    if (tabUrl === '' || jsonScripts.length == 0) {
        return new Card().warning(`No Structured Data found on this page.`)
    }

    return jsonScripts.reduce(
        (report, ldJson) => (report += ldJsonCard(ldJson, tabUrl)),
        ''
    )
}

const injector = (): iJsonLD[] =>
    [...document.scripts]
        .filter(s => s.type === 'application/ld+json')
        .map(s => JSON.parse(s.text.trim()))

const eventManager = () => undefined

export const actions: sectionActions = {
    injector: injector,
    reporter: reporter,
    eventManager: eventManager,
}
