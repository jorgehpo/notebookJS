const config = {
  entry: ['./js/index.js'],
  output: {
    path: __dirname + '/build',
    filename: 'baseballvisualizer.js',
    library: 'baseballvisualizer'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude:  /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/react']
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: "url-loader",
        options: {
          limit: Infinity // everything
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  devServer:{
    writeToDisk:true,
    hot:false,
    inline: false,
  },
  mode: 'development'
};
module.exports = config;
