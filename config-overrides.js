module.exports = {
        webpack: function (config, env) {
        config.resolve.fallback = {
            "https": require.resolve("https-browserify"),
            "buffer": require.resolve("buffer/"),
            "url": require.resolve("url/"),
            "querystring": require.resolve("querystring-es3"),
        };
        return config;
        },
    };
    