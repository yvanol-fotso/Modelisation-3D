self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://play.google.com/store/apps/details?id=com.google.ar.core')
    );
});
