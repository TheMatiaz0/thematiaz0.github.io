const fs = require('fs');
const url = require('url');

module.exports = (output) => ({
    server: {
        baseDir: `${output}`,
        middleware: [
            function (req, res, next) {
                let file = url.parse(req.url);
                file = file.pathname;
                // file = file.replace(/\/+$/, ''); // remove trailing hash
                file = `${output}/${file}.html`;

                if (fs.existsSync(file)) {
                    const content = fs.readFileSync(file);
                    res.write(content);
                    res.writeHead(200);
                    res.end();
                } else {
                    return next();
                }
            },
        ],
    },
});