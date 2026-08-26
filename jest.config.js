// Pacotes do ecossistema React Native publicados como ESM/TS puro.
// O preset do RN so transpila `react-native` e `@react-native/*`; sem
// ampliar essa lista o Jest quebra com "Cannot use import statement
// outside a module" no primeiro import de navegacao/gesture.
//
// `[^/]*` faz o match cobrir o segmento inteiro do pacote, entao
// `react-native[^/]*` pega tambem `react-native-drawer-layout`,
// `react-native-gesture-handler`, etc. sem precisar listar um a um.
const transpilarNodeModules = [
  '@react-native[^/]*',
  'react-native[^/]*',
  '@react-navigation[^/]*',
  'nanoid',
  'use-latest-callback',
];

module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    `node_modules/(?!(?:${transpilarNodeModules.join('|')})/)`,
  ],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/styles/**',
  ],
};
