importScripts('./ngsw-worker.js');

(function () {
    'use strict';

    self.addEventListener('notificationclick', (event) => {
        const comment = event.notification.data;
        if (clients.openWindow && comment) {
            event.waitUntil(clients.openWindow(`https://nyaa.si/view/${comment.nyaaId}#${comment.commentId}`));
        }
    });}
());