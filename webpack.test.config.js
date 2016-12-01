module.exports = {
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          plugins: ['istanbul'],
        },
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
};
