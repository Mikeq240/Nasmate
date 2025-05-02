const path = require('path');
module.exports = {
  entry: './src/extension.js',
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  externals: {
    vscode: 'commonjs vscode'
  },
  mode: 'production'
};