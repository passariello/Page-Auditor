// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import * as Tips from './tips'
import * as File from '../file'
import {Report} from '../report'
import {Card, CardKind, iLink} from '../card'
import {codeBlock} from '../codeBlock'
import {Errors} from './errors'
import {Mode} from "../colorCode"
import {disposableId, formatNumber} from '../main'
import {iSmCandidate, SmList, SmSource} from '../sitemapList'
import {htmlDecode} from 'js-htmlencode'
import { specs } from './specs'


const sitemapCard = (sm: iSmCandidate, sitemaps: SmList, report: Report) =>
    File.read(sm.url, File.xmlContentType)
        .then(sitemapBody => {
            const validationLink = `https://www.xml-sitemaps.com/validate-xml-sitemap.html?op=validate-xml-sitemap&go=1&sitemapurl=${encodeURI(
                sm.url
            )}`
            if (sm.url.endsWith('.gz')) {
                const fileName = sm.url.replace(/(.*)\/([a-z0-9\-_\.]+(\.xml)?(\.gz)?)(.*)/i, '$2')
                const table = [
                    ['Validate Sitemap', `<a class='small-btn' href='${validationLink}' target='_blank'>Validate ${fileName}</a>`],    
                    ['File Name', fileName],
                    ['Compressed', 'Yes'],
                    ['Compression type', 'Gzip'],
                ]

                const card = new Card(CardKind.report)
                    .open(`Detected Sitemap #${sitemaps.doneList.length + 1} (Compressed)`, fileName, 'icon-sitemap')
                    .addParagraph(`Found a compressed <code>sitemap.xml</code> file at the url:`)
                    .addCodeBlock(sm.url, Mode.txt)
                    .addTable('Sitemap Analysis', table)
                    .addParagraph(`Unable to display the content of compressed files.`)
                    .tag('card-ok')
                report.addCard(card)
                sitemaps.addDone(sm)
                File.exists(sm.url, File.xmlContentType).catch(() => Tips.compressedSitemapNotFound(card, sm.url, sm.source))
                return
            }

            if (sitemapBody.match(/not found/gim) !== null || sitemapBody.match(/error 404/gim) !== null) {
                const card = Errors.sitemap_404(sm)
                report.addCard(card)
                Tips.missingSitemap(card)
                sitemaps.addDone(sm)
                return
            }

            if (sitemapBody.includes(`<head>`) || sitemapBody.includes(`<meta`)) {
                const card = Errors.sitemap_IsARedirect(sm, sitemapBody)
                report.addCard(card)
                Tips.missingSitemap(card)
                sitemaps.addDone(sm)
                return
            }

            const fileName = sm.url.replace(/(.*)\/([a-z0-9\-_\.]+(\.xml)?)(\?.*)?/i, '$2')

            const divId = disposableId()
            const btnLabel = `Sitemap.xml`
            const links = sitemapAllLinks(sitemapBody)
            const linksToSitemaps = sitemapLinksToSitemap(sitemapBody, SmSource.SitemapIndex)
            const linksToPages = links.length - linksToSitemaps.length
            const sitemapXmlDescription =
                `A good XML sitemap acts as a roadmap of your website that leads Google to all your important pages. ` +
                `XML sitemaps can be good for SEO, as they allow Google to find your essential website pages quickly, even if your internal linking isn't perfect.`
            const table = [
                ['Validate Sitemap', `<a class='small-btn' href='${validationLink}' target='_blank'>Validate ${fileName}</a>`],
                ['File Name', fileName],
                ['File Size', formatNumber(sitemapBody.length) + ' bytes'],
                ['Sitemap Type', linksToSitemaps.length > 0 ? 'Sitemap Index' : 'Sitemap'],
                ['Pages', `${linksToPages === 0 ? 'No' : formatNumber(linksToPages)} pages linked`],
                [
                    'Sub Sitemap',
                    linksToSitemaps.length == 0
                        ? 'No links to other sitemaps'
                        : `${formatNumber(linksToSitemaps.length)} sitemaps linked`,
                ],
                ['Compressed', 'No Compression Detected'],
            ]

            const card = new Card(CardKind.report)
                .open(`Detected Sitemap  #${sitemaps.doneList.length + 1}`, fileName, 'icon-sitemap')
                .addParagraph(`Found a <code>sitemap.xml</code> file at the url:`)
                .addCodeBlock(sm.url, Mode.txt)
                .addParagraph(sitemapXmlDescription)
                .addTable('Sitemap Analysis', table)
                .addExpandableBlock(btnLabel, codeBlock(sitemapBody, Mode.xml, divId))
                .tag('card-ok')

            report.addCard(card)

            if (sitemapBody.length > specs.siteMap.RecommendedMaxUncompressedSize) {
                Tips.uncompressedLargeSitemap(card, sm.url, sitemapBody.length)
            }
            if (!fileName.includes('.xml')) {
                Tips.sitemapWithoutXmlExtension(card, sm.url)
            }
            sitemaps.addDone(sm)
            sitemaps.addToDo(sitemapLinksToSitemap(sitemapBody, SmSource.SitemapIndex))

            return
        })
        .catch(() => sitemaps.addFailed(sm))

export const createSiteMapCards = (sitemaps: SmList, report: Report) => {
    const promises = sitemaps.toDoList.map(sm => sitemapCard(sm, sitemaps, report))

    return Promise.allSettled(promises).then(() => sitemaps.toDoList.map(sm => sitemapCard(sm, sitemaps, report)))
}

export const sitemapLinksToSitemap = (sitemapBody: string, source: SmSource): iSmCandidate[] => {
    let subSitemaps = (sitemapBody.match(
        /<sitemap>\s*<loc>(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9\-]+\.[^(\s|<|>)]{2,})<\/loc>/gim
    ) ?? []) as string[]
    subSitemaps = subSitemaps.map(link => link.replace(/(<\/?sitemap>|<\/?loc>)/gm, '').trim())
    subSitemaps = subSitemaps.map(link => htmlDecode(link))
    return sanitizeUrls(subSitemaps).map(url => ({url: url, source: source}))
}

export const sitemapAllLinks = (sitemapBody: string) => {
    let subSitemaps = (sitemapBody.match(
        /<loc>(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9\-]+\.[^(\s|<|>)]{2,})<\/loc>/gim
    ) ?? []) as string[]
    subSitemaps = subSitemaps.map(link => link.replace(/<\/?loc>/gm, '').trim())
    subSitemaps = subSitemaps.map(link => htmlDecode(link))
    return sanitizeUrls(subSitemaps)
}


const sanitizeUrls = (urls: string[]) => {
    return urls.map(url => url.replace(`http://`, `https://`))
}
