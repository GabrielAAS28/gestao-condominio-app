import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';

// CORREÇÃO: Como o App.js está na raiz, os caminhos para os
// arquivos dentro da pasta 'src' devem começar com './src/'.
import { AuthProvider } from './src/contexts/AuthContext';
import { CondominioProvider } from './src/contexts/CondominioContext';
import Routes from './src/routes';
import theme from './src/styles/theme';

const App = () => {
  return (
    <NavigationContainer>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <CondominioProvider>
            <Routes />
          </CondominioProvider>
        </AuthProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
};

export default App;
