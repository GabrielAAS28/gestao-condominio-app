# CI/CD — Gestão Condomínio (App)

## Este app não vai para o Railway

Este repositório é um app **React Native 0.80** (Android/iOS). O Railway
hospeda serviços de longa duração acessíveis por HTTP — não distribui
aplicativos móveis. O artefato aqui é um **APK/AAB** (Play Store) ou
**IPA** (App Store), não um container.

Quem vai para o Railway é o backend: `api-gestao-condominio`.

**Distribuição correta deste app:**

| Destino | Ferramenta |
|---|---|
| Teste interno | Artefato APK do CI (aba Actions → run → Artifacts) |
| Beta | Firebase App Distribution ou Play Console (Internal Testing) |
| Produção | Google Play Console / App Store Connect |
| Automação de release | Fastlane, ou `r0adkll/upload-google-play` no Actions |

---

## O que o CI faz hoje

| Job | O que valida |
|---|---|
| `quality` | ESLint (com orçamento de warnings), `tsc --noEmit`, Jest + cobertura |
| `bundle` | Bundle Metro de produção + compilação Hermes do bundle |
| `android` | `./gradlew assembleRelease` → publica o APK como artefato |
| `ci-gate` | Job único agregador — use **este** na branch protection |

### Sobre o job `bundle`

O ESLint não resolve imports em runtime. O bundle do Metro sim: se alguém
renomear um arquivo e esquecer um import, o lint passa e o **bundle quebra**.
Esse job pega isso antes do merge.

A etapa seguinte roda o `hermesc` — o compilador do Hermes, que é o motor JS
deste app (`hermesEnabled=true` em `android/gradle.properties`). Ela garante
que o bundle compila para bytecode, que é exatamente o que acontece no build
de release.

> Nota: **Hermes é o motor JavaScript do React Native, não um linter.** As
> ferramentas de análise estática aqui são o ESLint, o TypeScript e o
> CodeRabbit AI.

---

## Assinatura do APK — pendência de release

`android/app/build.gradle` assina o build de **release com a debug.keystore**
(padrão do template do React Native, linhas 100-106):

```gradle
release {
    // Caution! In production, you need to generate your own keystore file.
    signingConfig signingConfigs.debug
}
```

O APK gerado pelo CI serve para **teste interno apenas**. A Play Store
rejeita APK assinado com a chave de debug.

### Para assinar de verdade

1. Gerar a keystore de upload:

   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore upload.keystore \
     -alias upload -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Guardar como secrets do GitHub (`Settings → Secrets → Actions`):

   | Secret | Conteúdo |
   |---|---|
   | `ANDROID_KEYSTORE_BASE64` | `base64 -w0 upload.keystore` |
   | `ANDROID_KEYSTORE_PASSWORD` | senha da store |
   | `ANDROID_KEY_ALIAS` | `upload` |
   | `ANDROID_KEY_PASSWORD` | senha da chave |

3. Trocar o `signingConfigs.release` no `build.gradle` para ler dessas
   variáveis, e restaurar o arquivo no workflow antes do `assembleRelease`.

**Nunca commite a keystore de produção.** O `gitleaks` no workflow
`security.yml` já procura por isso nos PRs.

---

## Orçamento de warnings do ESLint

`npm run lint:ci` roda com `--max-warnings=79`, o número de warnings hoje
(quase todos `react-native/no-inline-styles`). Isso trava a regressão: PR que
adiciona warning novo falha. Conforme forem corrigidos, baixe o número no
`package.json` até chegar a `0`.

---

## Scripts

```bash
npm run lint         # ESLint com saída completa
npm run lint:ci      # ESLint com orçamento de warnings (igual ao CI)
npm run typecheck    # tsc --noEmit
npm test             # Jest
npm run test:ci      # Jest com cobertura, modo CI
npm run format       # Prettier --write
npm run format:check # Prettier --check
```
