function updateVisibility() {
    // Get current time in PST/PDT
    const options = { timeZone: 'America/Los_Angeles' };
    const now = new Date().toLocaleString('en-US', options);
    const pstDate = new Date(now);
    
    // Get day of week (0 = Sunday, 1 = Monday, ..., 5 = Friday)
    const dayOfWeek = pstDate.getDay();
    
    // Get current hour in 24-hour format
    const currentHour = pstDate.getHours();
    
    // Define live hours (11am to 2pm)
    const liveStartHour = 11;
    const liveEndHour = 14; // 2pm in 24-hour format
    
    // Check if current time is within live window (M-F, 11am-2pm)
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const isLiveHours = currentHour >= liveStartHour && currentHour < liveEndHour;
    const isLive = isWeekday && isLiveHours;
    
    // Get the elements
    const liveDiv = document.querySelector('.live-indicator');
    const offlineDiv = document.querySelector('.offline-indicator');
    
    // Set visibility based on schedule
    if (liveDiv) {
        liveDiv.style.display = isLive ? 'block' : 'none';
    }
    
    if (offlineDiv) {
        offlineDiv.style.display = isLive ? 'none' : 'block';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update visibility immediately
    updateVisibility();
    
    // Then update every minute
    setInterval(updateVisibility, 60000);
}); 