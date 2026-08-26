/* eslint-env jest */
/**
 * Setup global do Jest.
 * Modulos nativos nao existem no ambiente Node do Jest, entao sao mockados
 * aqui — caso contrario qualquer teste que importe o App quebra no import.
 */

require('react-native-gesture-handler/jestSetup');

// Reanimated: mock oficial + silencia o warning de "reduced motion".
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

// AsyncStorage: implementacao em memoria mantida pelo proprio pacote.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Push notifications: nao ha bridge nativa nos testes.
jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  localNotification: jest.fn(),
  localNotificationSchedule: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  createChannel: jest.fn(),
  requestPermissions: jest.fn(),
}));

jest.mock('@react-native-community/push-notification-ios', () => ({
  addEventListener: jest.fn(),
  requestPermissions: jest.fn(() => Promise.resolve()),
  FetchResult: { NoData: 'NoData' },
}));

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-vector-icons/Feather', () => 'Icon');

jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
}));

