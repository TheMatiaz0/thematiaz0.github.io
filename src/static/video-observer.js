const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target;

        if (entry.isIntersecting) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    });
}, {
    threshold: 0.5
});

function setupVideoObserver() {
    document.querySelectorAll('.video video').forEach(video => {
        videoObserver.observe(video);
    });
}

setupVideoObserver();