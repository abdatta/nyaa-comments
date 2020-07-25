import { config } from 'dotenv'; config();
import { Store } from './store';
import { Repository } from './repository';
import { Scraper } from './scraper';
import { Server } from './server';
import { sendNotification, setVapidDetails } from 'web-push';
import { NyaaComment } from './types';

const store = new Store();
const repository = new Repository(store);
const scraper = new Scraper();

new Server(repository).start();

const main = async () => {
    const user = process.env.NYAA_USER || '';
    console.log(`Searching for new comments on ${user}'s torrents`);
    const items = [...await scraper.scrapeItems(user, 1), ...await scraper.scrapeItems(user, 2)]
    await Promise.all(items.filter(item => item.comments).map(async item => {
        const exists = await repository.countComments(item.nyaaId);
        if (item.comments <= exists) return;
        console.log(`Found new comments on torrent: ${item.name}`);
        const comments = await scraper.scrapeComments(item);
        await Promise.all(comments.map(comment => repository.upsertComments(comment)));
        console.log(`Updated ${item.comments} comments on torrent: ${item.name}`);
        comments.slice(exists, item.comments).forEach(notify);
    }))
};

setVapidDetails(process.env.VAPID_SUBJECT!, process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);

const notify = async (comment: NyaaComment) => {
    if (process.env.SEND_NOTIFICATIONS !== 'true') { return; }

    const notification = {
        title: `New Comment by ${comment.user}`,
        body: comment.comment,
        icon: comment.avatar,
        vibrate: [100, 50, 100]
    };

    const allSubscriptions = await repository.getSubscriptions();

    await Promise.all(allSubscriptions.map(sub => sendNotification(sub, JSON.stringify({ notification }))));
    console.log(`Notification sent for ${notification.title}`);
}

const interval = (parseInt(process.env.NYAA_INTERVAL!) || 15) * 60 * 1000;
setInterval(main, interval);
