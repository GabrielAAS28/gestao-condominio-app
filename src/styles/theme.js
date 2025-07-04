// Este objeto define o padrão de design para todo o aplicativo.
// Usar um tema garante consistência e facilita a manutenção.
export default {
  colors: {
    primary: '#0D47A1',     // Um azul mais escuro e sóbrio
    secondary: '#1976D2',   // Um azul secundário para botões e destaques
    
    background: '#F5F5F5',  // Um cinza bem claro para o fundo
    card: '#FFFFFF',        // Cor dos cards e elementos de superfície
    
    text: '#212121',        // Cor principal do texto
    text_secondary: '#757575', // Cor para textos de apoio, legendas
    
    success: '#2E7D32',     // Verde para mensagens de sucesso
    error: '#C62828',       // Vermelho para mensagens de erro
    warning: '#FF8F00',     // Laranja para alertas

    white: '#FFFFFF',
    black: '#000000',
    border: '#E0E0E0',      // Cor para bordas e divisores
  },

  fonts: {
    // Lembre-se de adicionar os arquivos de fonte na pasta 'src/assets/fonts'
    // e linká-los no seu projeto (react-native.config.js).
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },

  spacing: {
    // Unidades de espaçamento para margens e paddings
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  border_radius: {
    // Raios de borda para consistência
    sm: 4,
    md: 8,
  }
};
// Este arquivo define o tema do aplicativo, incluindo cores, fontes e espaçamento.