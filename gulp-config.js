module.exports = {
    scripts: {
        files: [
            {
                name: 'wf.accordion.min',
                inputPath: [
                    'src/main.js',
                ],
                destDir: 'dist'
            }
        ],
    },
    "env": 'production',
    "webdir": ".",
    "npmdir": "node_modules",
}
