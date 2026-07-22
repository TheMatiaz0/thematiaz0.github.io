async function chooseVideoSource(video) {
    const connection = navigator.connection;
    const previewThreshold = 200;

    if (connection?.saveData) {
        return video.dataset.preview;
    }

    if (
        connection &&
        [
            "slow-2g",
            "2g",
            "3g"
        ].includes(connection.effectiveType)
    ) {
        return video.dataset.preview;
    }

    try {
        const start = performance.now();

        await fetch(video.dataset.preview, {
            method: "HEAD",
            cache: "no-store"
        });

        const elapsed = performance.now() - start;

        if (elapsed > previewThreshold) {
            return video.dataset.preview;
        }

    } catch {
        return video.dataset.preview;
    }

    return video.dataset.full;
}

const videoObserver = new IntersectionObserver((entries) => {

    entries.forEach(async entry => {

        const video = entry.target;

        if (entry.isIntersecting) {
            if (!video.dataset.loaded) {
                const source = await chooseVideoSource(video);

                video.src = source;
                video.load();
                video.play().catch(() => {});
                video.dataset.loaded = "true";

            } else {
                video.play().catch(() => {});
            }

        } else {
            video.pause();
        }
    });
}, {
    rootMargin: "100px",
    threshold: 0
});

function setupVideoObserver() {
    document
        .querySelectorAll("video")
        .forEach(video => {
            videoObserver.observe(video);
        });
}


setupVideoObserver();