import { get } from "request-promise-native";
import { load } from "cheerio";

export const scrapeItems = async (user: string, page = 1): Promise<NyaaItem[]> => {
    const $ = load(await get(`https://nyaa.si/user/${user}?p=${page}`));
    const rawItems = $('table.torrent-list > tbody > tr').toArray();
    return rawItems.map(item => ({
        comments: +($(item).find('td[colspan=2]').find('a.comments').text().trim()),
        name: $(item).find('td[colspan=2]').find('a:not(.comments)').text().trim(),
        nyaaId: $(item).find('td[colspan=2]').find('a:not(.comments)').attr('href')?.slice('/view/'.length) ?? '',
        timestamp: +($(item).find('td[data-timestamp]').attr('data-timestamp') ?? '') * 1000
    }))
}

export const scrapeComments = async (nyaaId: string): Promise<NyaaComment[]> => {
    const $ = load(await get(`https://nyaa.si/view/${nyaaId}`));
    const rawComments = $('#comments > div > [id^=com-]').toArray();
    return rawComments.map(comment => ({
        nyaaId, user: $(comment).find('[title=User]').text().trim(),
        comment: $(comment).find('.comment-body > div[id^=torrent-comment]').text().trim(),
        commentId: $(comment).find('.comment-body > div[id^=torrent-comment]').attr('id') ?? '',
        timestamp: +($(comment).find('[data-timestamp]').attr('data-timestamp') ?? '') * 1000
    }));
}

export interface NyaaItem {
    comments: number;
    name: string;
    nyaaId: string;
    timestamp: number
}

export interface NyaaComment {
    user: string;
    timestamp: number;
    comment: string;
    commentId: string;
    nyaaId: string;
}
