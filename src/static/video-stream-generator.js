const fg = require("fast-glob");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");


async function generateVideos() {

    const videos = await fg([
        "src/static/projects/**/*.mp4",
        "!src/static/projects/**/*-preview.mp4"
    ]);

    console.log("Found videos:");
    console.log(videos);


    for (const input of videos) {

        const folder = path.dirname(input);
        const filename = path.basename(input, ".mp4");
        const previewOutput = path.join(
            folder,
            `${filename}-preview.mp4`
        );

        if (!fs.existsSync(previewOutput)) {

            console.log(`Generating preview: ${input}`);
            const previewCommand = [
                "ffmpeg",
                "-y",
                "-i",
                `"${input}"`,
                "-vf",
                `"scale=w=640:h=360"`,
                "-c:v",
                "libx264",
                "-crf",
                "30",
                "-preset",
                "fast",
                "-an",
                "-movflags",
                "+faststart",
                `"${previewOutput}"`
            ].join(" ");


            execSync(previewCommand, {
                stdio: "inherit"
            });

        } else {
            console.log(`Skipping existing preview: ${previewOutput}`);
        }

        const posterOutput = path.join(
            folder,
            `${filename}-poster.webp`
        );

        if (!fs.existsSync(posterOutput)) {

            console.log(`Generating poster: ${input}`);
            const posterCommand = [
                "ffmpeg",
                "-y",
                "-ss",
                "0.5",
                "-i",
                `"${input}"`,
                "-frames:v",
                "1",
                "-vf",
                `"scale=w=1280:h=-1"`,
                "-c:v",
                "libwebp",
                "-quality",
                "80",
                `"${posterOutput}"`
            ].join(" ");

            execSync(posterCommand, {
                stdio: "inherit"
            });

        } else {
            console.log(`Skipping existing poster: ${posterOutput}`);
        }
    }
}

generateVideos()
    .catch(err => {
        console.error(err);
        process.exit(1);
    });