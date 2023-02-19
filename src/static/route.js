function goBack() {
    const previousUrl = document.referrer;
    const currentDomain = window.location.hostname;
    if (!previousUrl) {
        window.location.href = '/';
        return;
    }
    try {
        const previousDomain = new URL(previousUrl).hostname;
        if (previousDomain === currentDomain) {
            history.back();
        } else {
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error parsing URL:', error);
        window.location.href = '/';
    }
}