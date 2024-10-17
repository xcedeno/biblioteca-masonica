const path = require('path');

module.exports = {
  // Otras configuraciones...
    resolve: {
        fallback: {
        "buffer": require.resolve("buffer/"),
            "url": require.resolve("url/"),
        "https": require.resolve("https-browserify"),
        "querystring": require.resolve("querystring-es3"),
        },
    },
    // Asegúrate de incluir tus entradas y salidas aquí
    entry: './src/index.js', // o tu archivo de entrada
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
  // Otras configuraciones...
};
