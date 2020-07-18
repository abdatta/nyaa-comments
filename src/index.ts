import { get } from "request-promise-native";
import { load } from "cheerio";

export const scrapeItems = async (user: string, page = 1): Promise<NyaaItem[]> => {
    const $ = load(await get(`https://nyaa.si/user/${user}?p=${page}`));
    const rawItems = $('table.torrent-list > tbody > tr').toArray();
    return rawItems.map(item => ({
        comments: +($(item).find('td[colspan=2]').find('a.comments').text().trim()),
        name: $(item).find('td[colspan=2]').find('a:not(.comments)').text().trim(),
        nyaa_id: $(item).find('td[colspan=2]').find('a:not(.comments)').attr('href')?.slice('/view/'.length) ?? '',
        timestamp: +($(rawItems[0]).find('td[data-timestamp]').attr('data-timestamp') ?? '') * 1000
    }))
}

export interface NyaaItem {
    comments: number;
    name: string;
    nyaa_id: string;
    timestamp: number
}
