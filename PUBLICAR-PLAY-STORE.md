# Publicar na Play Store

Guia do caminho completo: do código até o app na loja.

---

## 1. O app já aponta para produção

`src/services/api.js` decide a URL pelo `__DEV__`, que o Metro injeta:

| Build | `__DEV__` | URL usada |
|---|---|---|
| `react-native run-android` | `true` | `http://10.0.2.2:3000/api` |
| `assembleRelease` / `bundleRelease` | `false` | `https://api-gestao-condominio-production.up.railway.app/api` |

Você não precisa trocar constante antes de gerar o build — e, mais
importante, não corre o risco de publicar apontando para `localhost`.

> A URL de produção **precisa** ser HTTPS. Desde o `targetSdk 28` o Android
> bloqueia tráfego em texto puro, e um `http://` aqui falharia só no app
> publicado, onde é mais caro descobrir.

Se um dia mudar o domínio da API, é só editar `PROD_BASE_URL`.

---

## 2. Gerar a keystore de upload

**Uma vez só, e guarde bem.**

O que você gera aqui é a **chave de upload**, que serve para provar ao Google
que o envio é seu. Com o Play App Signing ativo (padrão para apps novos), a
**chave de assinatura** do app é outra, gerada e guardada pelo Google.

Consequência prática: perder a `upload.keystore` **não** significa perder o
app. Você fica impedido de enviar novas versões até pedir um *reset da chave
de upload* no Play Console, e depois volta a publicar normalmente.

O que seria irreversível é perder a chave de assinatura — e essa o Google
guarda para você. Só que isso vale **se** o Play App Signing estiver ativo;
sem ele, perder a keystore realmente inviabiliza atualizar o app. Confirme
que está ativo em *Configuração → Assinatura de apps* no Play Console.

Ainda assim, trate a keystore como algo a não perder: o reset é burocracia
que trava o release por dias.

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore upload.keystore \
  -alias upload \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=CONDIGTAL, O=CONDIGTAL, L=SuaCidade, ST=SeuEstado, C=BR"
```

Ele pede uma senha. Anote junto do arquivo.

**Onde guardar:** fora do repositório e com backup — gerenciador de senhas,
cofre da empresa, ou um drive privado. O `.gitignore` já bloqueia `*.keystore`
e `*.jks`, mas isso protege contra commit acidental, não contra perder o
arquivo junto com a máquina.

---

## 3. Configurar a assinatura

Coloque as quatro propriedades no **`gradle.properties` do seu usuário**, que
fica fora do repositório:

| Sistema | Caminho |
|---|---|
| Windows | `C:\Users\<voce>\.gradle\gradle.properties` |
| macOS / Linux | `~/.gradle/gradle.properties` |

```properties
CONDIGTAL_UPLOAD_STORE_FILE=C:/caminho/absoluto/para/upload.keystore
CONDIGTAL_UPLOAD_STORE_PASSWORD=sua-senha
CONDIGTAL_UPLOAD_KEY_ALIAS=upload
CONDIGTAL_UPLOAD_KEY_PASSWORD=sua-senha
```

Fora do repositório é melhor que dentro: não depende de ninguém acertar o
`.gitignore` para a senha não vazar num commit.

Alternativa, se preferir por projeto: `android/gradle.properties` funciona,
mas ele **é versionado** — nesse caso confira o `.gitignore` antes.

> Não use `gradle.properties.local`. O Gradle não carrega esse arquivo
> automaticamente, e o resultado seria um build de release silenciosamente
> assinado em debug.

Passar por linha de comando também funciona, útil em CI:

```bash
./gradlew bundleRelease -PCONDIGTAL_UPLOAD_STORE_FILE=... -PCONDIGTAL_UPLOAD_STORE_PASSWORD=...
```

O `android/app/build.gradle` exige as **quatro** juntas: configuração parcial
falha com mensagem dizendo qual está faltando, em vez de estourar um
`MissingPropertyException` no meio da configuração do projeto. Ele também
confere se o arquivo da keystore existe no caminho informado.

Conferir se pegou:

```bash
cd android && ./gradlew :app:signingReport --no-daemon
```

Procure `Variant: release`. Se aparecer `Config: release` e o caminho da sua
keystore, está certo. Se aparecer `Config: debug`, as propriedades não foram
lidas.

---

## 4. Versionar o release

`android/app/build.gradle`, hoje em:

```gradle
versionCode 1
versionName "1.0"
```

| Campo | Regra |
|---|---|
| `versionCode` | Inteiro. **Precisa crescer a cada envio.** A Play Store recusa um `versionCode` já usado, mesmo em faixa de teste |
| `versionName` | Texto para o usuário (`"1.0"`, `"1.2.3"`). Livre |

Esqueça de subir o `versionCode` e o upload é rejeitado — é o erro mais
comum em primeira publicação.

---

## 5. Gerar o AAB

A Play Store **não aceita APK** para apps novos. O formato é AAB.

```bash
cd android && ./gradlew bundleRelease --no-daemon
```

Saída em:

```
android/app/build/outputs/bundle/release/app-release.aab
```

Se a chave de upload não estiver configurada, o `bundleRelease` **falha de
propósito**, com a instrução do que definir. É melhor descobrir aqui do que
no upload do Play Console, depois de esperar o build inteiro.

O `assembleRelease` continua funcionando sem chave nenhuma, caindo na
`debug.keystore`. É o APK que o CI publica como artefato: serve para teste
interno e instalação direta, só não serve para a loja. Essa diferença é
intencional — forçar assinatura real no CI obrigaria a guardar a keystore
nos secrets do repositório.

Para testar o AAB num aparelho antes de subir, use a
[bundletool](https://developer.android.com/tools/bundletool).

---

## 6. Play Console

Acesso: <https://play.google.com/console> — a conta de desenvolvedor custa
**US$ 25, pagamento único**.

1. **Criar app** — nome, idioma, tipo (aplicativo), gratuito ou pago.
   *Atenção: gratuito → pago não é reversível depois.*
2. **Painel de configuração** — o Console lista o que falta. Os itens que
   costumam travar:
   - **Política de privacidade** (URL pública obrigatória)
   - **Classificação de conteúdo** (questionário)
   - **Público-alvo e conteúdo**
   - **Segurança dos dados** — declare o que o app coleta. Este app envia
     e-mail, senha e fotos para a API, então precisa ser declarado
   - **Ficha da loja** — descrição, ícone 512×512, banner 1024×500,
     no mínimo 2 screenshots de celular
3. **Versões → Teste interno** — suba o `.aab` aqui primeiro. Libera em
   minutos para até 100 testadores por e-mail, sem revisão demorada.
4. **Produção** — depois que o teste interno estiver de pé. A primeira
   revisão costuma levar de alguns dias a duas semanas.

### Sobre as permissões declaradas

O `AndroidManifest.xml` pede `CAMERA`, `READ_EXTERNAL_STORAGE` e
`WRITE_EXTERNAL_STORAGE`.

As duas de armazenamento são **descontinuadas** no Android 13+ e o Google
questiona o uso delas na revisão. Como o app usa `react-native-image-picker`,
que já funciona via seletor do sistema sem essas permissões, o caminho mais
tranquilo é removê-las do manifesto e testar o fluxo de foto. Menos atrito na
revisão e menos permissão pedida ao usuário.

### Play App Signing

O Google re-assina seu app com uma chave que ele guarda. A sua keystore vira
a **chave de upload**: serve para provar que o envio é seu.

Consequência prática boa: se você perder a chave de upload, dá para pedir
reset ao Google sem perder o app. Sem o Play App Signing, perder a chave
significaria publicar um app novo do zero.

---

## 7. Automatizar depois (opcional)

Quando o fluxo manual estiver rodando, dá para o CI gerar e enviar o AAB:

1. Guardar como secrets do GitHub:

   | Secret | Conteúdo |
   |---|---|
   | `ANDROID_KEYSTORE_BASE64` | `base64 -w0 upload.keystore` |
   | `ANDROID_KEYSTORE_PASSWORD` | senha da store |
   | `ANDROID_KEY_ALIAS` | `upload` |
   | `ANDROID_KEY_PASSWORD` | senha da chave |

2. No workflow: restaurar a keystore do base64 num arquivo temporário e
   passar as quatro propriedades via `ORG_GRADLE_PROJECT_*`.

3. Enviar com [`r0adkll/upload-google-play`](https://github.com/r0adkll/upload-google-play),
   usando uma service account do Google Play.

Deixe para depois do primeiro envio manual: automatizar um processo que você
ainda não executou uma vez costuma esconder o erro em vez de evitá-lo.
