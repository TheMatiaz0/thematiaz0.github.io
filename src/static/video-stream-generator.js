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

        const output = path.join(
            folder,
            `${filename}-preview.mp4`
        );

    if (fs.existsSync(output)) {
        console.log(`Skipping existing preview: ${output}`);
        continue;
    }

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
        `"${output}"`
    ].join(" ");

        execSync(previewCommand, {
            stdio: "inherit"
        });
    }
}


generateVideos()
    .catch(err => {
        console.error(err);
        process.exit(1);
    });