const path = require('path')

module.exports = {
    mode: 'development',
    entry: "./src/app.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "news.js"
    },
    module: {
        rules: [
            {
                include: [path.resolve(__dirname, "src")],
                loader: "babel-loader",
                options: {
                    presets: ["es2015"]
                }
            }
        ]
    },          
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "app")
        ],
        extensions: [".js", ".json", ".jsx", ".css"],
    },
    watch:true
}
