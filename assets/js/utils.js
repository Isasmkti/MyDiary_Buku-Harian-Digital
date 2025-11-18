// Utility functions for the LogLive application

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Debounce function for search/input delays
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Get mood emoji based on mood value
function getMoodEmoji(mood) {
    switch (mood) {
        case 1: return '😠';
        case 2: return '😞';
        case 3: return '😐';
        case 4: return '😊';
        case 5: return '😄';
        default: return '😐';
    }
}

// Get priority color
function getPriorityColor(priority) {
    switch (priority) {
        case 'high': return 'red';
        case 'medium': return 'yellow';
        case 'low': return 'green';
        default: return 'gray';
    }
}

// Export functions (for module systems that support it)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        formatDate,
        generateId,
        debounce,
        truncateText,
        getMoodEmoji,
        getPriorityColor
    };
}