## O que muda

<!-- Descreva objetivamente o que este PR faz. -->

## Por que

<!-- Contexto/problema que motivou a mudanca. -->

## Como testar

1.
2.

## Evidencia

<!-- Screenshot ou video da tela alterada, se for mudanca de UI. -->

## Checklist

- [ ] `npm run lint:ci` passa localmente
- [ ] `npm run typecheck` passa localmente
- [ ] `npm test` passa localmente
- [ ] Testado em Android
- [ ] Nao introduzi novos warnings de ESLint (o CI trava no orcamento atual)
- [ ] Novas dependencias nativas: rodei `cd android && ./gradlew clean` e validei o build
- [ ] Nenhum `console.log` com token, senha ou dado pessoal

## Impacto

- [ ] Apenas UI
- [ ] Muda contrato com a API (backend precisa de PR correspondente)
- [ ] Adiciona dependencia nativa (exige novo build, nao so OTA)
- [ ] Muda permissao no AndroidManifest
