import Bottleneck from 'bottleneck';
import { get } from "request-promise-native";
import { load } from "cheerio";
import { NyaaItem, NyaaComment } from "./types";

export class Scraper {
    private ratelimiter = new Bottleneck({
        maxConcurrent: 1,
        minTime: 333
    });

    get(url: string) {
        return this.ratelimiter.schedule(() => get(url));
    }

    async scrapeItems(user: string, page = 1): Promise<NyaaItem[]> {
        const $ = load(await this.get(`https://nyaa.si/user/${user}?p=${page}`));
        const rawItems = $('table.torrent-list > tbody > tr').toArray();
        return rawItems.map(item => ({
            comments: +($(item).find('td[colspan=2]').find('a.comments').text().trim()),
            name: $(item).find('td[colspan=2]').find('a:not(.comments)').text().trim(),
            nyaaId: $(item).find('td[colspan=2]').find('a:not(.comments)').attr('href')?.slice('/view/'.length) ?? '',
            timestamp: +($(item).find('td[data-timestamp]').attr('data-timestamp') ?? '') * 1000
        }))
    }

    async scrapeComments(nyaaItem: NyaaItem): Promise<NyaaComment[]> {
        const $ = load(await this.get(`https://nyaa.si/view/${nyaaItem.nyaaId}`));
        const rawComments = $('#comments > div > [id^=com-]').toArray();
        return rawComments.map(comment => ({
            nyaaId: nyaaItem.nyaaId, torrentName: nyaaItem.name,
            user: $(comment).find('[title=User]').text().trim(),
            avatar: $(comment).find('img.avatar').attr('src') ?? '',
            comment: $(comment).find('.comment-body > div[id^=torrent-comment]').text().trim(),
            commentId: $(comment).find('.comment-body > div[id^=torrent-comment]').attr('id') ?? '',
            timestamp: +($(comment).find('[data-timestamp]').attr('data-timestamp') ?? '') * 1000
        }));
    }
}
