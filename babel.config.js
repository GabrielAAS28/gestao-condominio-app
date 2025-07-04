module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          // Este alias nos permite usar '~/' para se referir à pasta 'src/'
          '~': './src',
        },
      },
    ],
  ],
};
// Este arquivo configura o Babel para o projeto React Native.
// Ele define presets e plugins necessários para compilar o código. 