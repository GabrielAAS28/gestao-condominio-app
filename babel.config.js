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
    // Adicionando o plugin do Reanimated. Ele DEVE ser o último da lista.
    'react-native-reanimated/plugin',
  ],
};
// Este arquivo é a configuração do Babel para o React Native.
// Ele define presets e plugins que ajudam na transpilação do código JavaScript moderno para uma versão compatível com o React Native.