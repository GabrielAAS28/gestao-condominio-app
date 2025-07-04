/**
 * @format
 */

import {AppRegistry} from 'react-native';
// CORREÇÃO: O caminho agora aponta para o App.js na raiz do projeto.
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
