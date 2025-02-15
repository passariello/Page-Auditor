// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Report} from '../report'
import {Card, CardKind} from '../card'
import {sectionActions, ReportGeneratorFunc, CodeInjectorFunc} from '../main'
import * as CardBlocks from '../card-blocks'

const scriptClasses = require('../jsons/scriptClasses.json') as any[]

const bioLinks = [
    {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/in/francofolini/',
        class: 'icon-linkedin',
    },
    {
        label: 'Medium',
        url: 'https://folini.medium.com/',
        class: 'icon-medium',
    },
    {
        label: 'Personal Blog',
        url: 'https://francofolini.com/',
        class: 'icon-wordpress',
    },
    {
        label: 'GIT',
        url: 'https://github.com/folini',
        class: 'icon-git',
    },
    {
        label: 'eMail',
        url: 'mailto:folini@gmail.com',
        class: 'icon-gmail',
    },
]

const suggestedSites = [
    {
        label: 'CNN',
        url: 'https://cnn.com/',
    },
    {
        label: 'MailChimp',
        url: 'https://mailchimp.com/',
    },
    {
        label: 'REI',
        url: 'https://rei.com/',
    },
]

const reportGenerator: ReportGeneratorFunc = (tabUrl: string, data: any, report: Report): void => {
    report
        .addCard(
            new Card(CardKind.report)
                .open('Credits', `Page Auditor for Technical SEO`, 'icon-fc')
                .add(
                    CardBlocks.paragraph(
                        `<b>Page Auditor for Technical SEO</b> is a free Extension for 
                    <a href='https://www.microsoft.com/en-us/edge' target='_new'>Microsoft Edge</a> and 
                    <a href='https://www.google.com/chrome/' target='_new'>Google Chrome</a> created by 
                    <a href='https://www.linkedin.com/in/francofolini/' target='_new'>Franco Folini</a>.
                <br><br>The purpose of <i>Page Auditor for Technical SEO</i> is to analyze and show, in a way that is simple and easy to understand, all SEO factors that can affect the SEO performance of a website or single webpage.
                <br><br>When possible, <i>Page Auditor</i> also provides suggestions on how to improve the page SEO and to fix a diagnosed problem.`,
                        'credits'
                    )
                )
                .add(
                    CardBlocks.paragraph(
                        `<form action="https://www.paypal.com/donate" method="post" target="_new" style="margin-bottom:0">
                    <input type="hidden" name="business" value="UZ2HN43RZVJGA" />
                    <input type="hidden" name="no_recurring" value="0" />
                    <input type="hidden" name="item_name" value="Support the development and maintenance of the free 'Page Auditor' Microsoft Edge and google Chrome and Extension." />
                    <input type="hidden" name="currency_code" value="USD" />
                    <div class='cta-toolbar'>
                        <input type="submit" name="submit" class='large-btn' value="Donate" border="0" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                    </div>
                </form>`,
                        'support-form'
                    )
                )
        )
        .addCard(
            new Card(CardKind.report)
                .open('Credits', `About the Author`, 'icon-franco-avatar')
                .add(
                    CardBlocks.paragraph(
                        `<b>Franco Folini</b> has a passion for Web Development and Digital Marketing.` +
                            `<br><br>Franco teaches the <a href='https://bootcamp.berkeley.edu/digitalmarketing/' target='+new'>Digital Marketing Bootcamp</a> for UC Berkeley Extension, and this project was inspired by his students.` +
                            `<br><br>Check out Franco's work and contacts on the following platforms:` +
                            `<ul class='pointers'>` +
                            bioLinks
                                .map(
                                    link =>
                                        `<li class='credits-pointer ${link.class}'><a href='${link.url}' target='_new'>${link.label}</a></li>`
                                )
                                .join('') +
                            `</ul>`
                    )
                )
        )
        .addCard(
            new Card(CardKind.report)
                .open(``, `Open-Source Project`, 'icon-open')
                .add(
                    CardBlocks.paragraph(
                        `<b>Page Auditor</b> is an open source project created by <a target="_new" href='https://www.linkedin.com/in/francofolini/'>Franco Folini</a>. 
                        That means anybody is free to use, study, modify, and distribute the source code of project for any purpose, within the limits set by the license.
                        <br/><br/>
                        <b>Page Auditor</b> source code is distributed with a <a target="_new" href='https://github.com/folini/Page-Auditor/blob/main/LICENSE.md'>BSD 3-Clause License</a>. 
                        <br/><br/>
                        The <b>Page Auditor</b> has been created using <a target="_new" href='https://www.typescriptlang.org/'>Typescript</a>. If you are not familiar with development, TypeScript is a superset of the famous JavaScript.
                        The project has been developed <a href='https://code.visualstudio.com/'>Visual Studio Code</a> and extensively tested using the 
                        <a target="_new" href='https://jestjs.io/'>JEST</a> testing tools.
                        <br/><br/>
                        You can access the source code on the <a target="_new" href='https://github.com/folini/Page-Auditor'>public project repository on GitHub</a>.`
                    )
                )
                .setPreTitle('Intro')
        )
        .completed()
}

export const actions: sectionActions = {
    reportGenerator: reportGenerator,
    codeToInject: null,
}
