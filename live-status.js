let notificationSent = false;

function updateVisibility() {
    const options = { timeZone: 'America/Los_Angeles' };
    const now = new Date().toLocaleString('en-US', options);
    const pstDate = new Date(now);
    
    const dayOfWeek = pstDate.getDay();
    const currentHour = pstDate.getHours();
    
    const liveStartHour = 11;
    const liveEndHour = 14;
    
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const isLiveHours = currentHour >= liveStartHour && currentHour < liveEndHour;
    const isLive = isWeekday && isLiveHours;
    
    const liveDiv = document.querySelector('.live-indicator');
    const offlineDiv = document.querySelector('.offline-indicator');
    
    if (liveDiv) liveDiv.style.display = isLive ? 'block' : 'none';
    if (offlineDiv) offlineDiv.style.display = isLive ? 'none' : 'block';

    // Send notification only once per page load when going live
    if (isLive && !notificationSent) {
        sendNotificationToAllUsers(
            'TBPN is Live',
            'John and Jordi are streaming now on Farcaster',
            'https://tbpn.vercel.app'
        );
        notificationSent = true;
    }
}

async function sendNotificationToAllUsers(title, body, targetUrl) {
    try {
        const res = await fetch('/api/notify-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                target_fids: "all",
                title,
                body,
                target_url: targetUrl
            })
        });

        const data = await res.json();
        if (!res.ok) {
            console.error('Notification error:', data);
        } else {
            console.log('Broadcast notification sent:', data);
        }
    } catch (err) {
        console.error('Notification broadcast failed:', err);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateVisibility();
    setInterval(updateVisibility, 60000);
});