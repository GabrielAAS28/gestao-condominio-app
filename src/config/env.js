/**
 * Configuracao de ambiente do app.
 *
 * Ponto unico onde endpoints e afins sao declarados. A camada de rede
 * (src/services/api.js) apenas consome o que sai daqui — assim um endereco
 * novo nao precisa ser cacado dentro do cliente HTTP.
 *
 * `__DEV__` e injetado pelo Metro: vale true em `react-native run-android` e
 * false em qualquer build de release (assembleRelease / bundleRelease). Ou
 * seja, o APK/AAB publicado usa producao sem depender de ninguem lembrar de
 * trocar uma constante antes de gerar o build.
 *
 * Se um dia for preciso um terceiro ambiente (homologacao) ou trocar a URL
 * sem recompilar, o caminho e substituir os objetos abaixo por
 * react-native-config lendo de .env. Como isso adiciona dependencia nativa
 * — e portanto rebuild e ajuste no CI — nao foi feito agora; a indirecao
 * deste arquivo e o que torna essa troca barata depois.
 */

const desenvolvimento = {
  // Emulador Android: 10.0.2.2 mapeia para o localhost da maquina host.
  // iOS Simulator:    'http://localhost:3000/api'
  // Device fisico:    IP da maquina na rede local, ex. 'http://192.168.1.10:3000/api'
  apiBaseUrl: 'http://10.0.2.2:3000/api',
};

const producao = {
  // Precisa ser HTTPS: desde o targetSdk 28 o Android bloqueia trafego em
  // texto puro, e um http:// aqui falharia so no app publicado.
  apiBaseUrl: 'https://api-gestao-condominio-production.up.railway.app/api',
};

const env = __DEV__ ? desenvolvimento : producao;

export const API_BASE_URL = env.apiBaseUrl;

export default env;
