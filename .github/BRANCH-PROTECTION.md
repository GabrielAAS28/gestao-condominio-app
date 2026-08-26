# Proteção da branch `main`

Objetivo: nenhum merge entra na `main` sem CI verde e sem o review
automático do CodeRabbit resolvido.

> O check `CI Gate` agrega Lint/Types/Tests, Metro Bundle + Hermes e Android Build.
> Basta exigir ele — não precisa listar os jobs individuais.

---

## Opção A — via `gh` CLI (recomendado)

Cole no terminal, já autenticado (`gh auth status`):

```bash
gh api -X PUT repos/GabrielAAS28/gestao-condominio-app/branches/main/protection   -H "Accept: application/vnd.github+json"   --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["CI Gate", "CodeQL", "Dependency Audit", "Secret Scan"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0
  },
  "restrictions": null,
  "required_linear_history": true,
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```

### Por que `required_approving_review_count: 0`

Você é o único mantenedor. Exigir 1 aprovação te trancaria fora do próprio
repositório — o GitHub não deixa você aprovar seu próprio PR, e aprovação
de bot (CodeRabbit) não conta como review humano em todos os planos.

O merge continua bloqueado pelos status checks e pelo
`required_conversation_resolution`. **Quando entrar mais gente no time,
suba para `1`.**

---

## Opção B — pela interface

`Settings → Branches → Add branch ruleset` (ou *Add rule*), branch `main`:

- [x] Require a pull request before merging
  - Required approvals: **0** (solo) ou **1** (com time)
  - [x] Dismiss stale pull request approvals when new commits are pushed
- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - Adicione: **CI Gate**, **CodeQL**, **Dependency Audit**, **Secret Scan**
- [x] Require conversation resolution before merging
- [x] Require linear history
- [ ] Allow force pushes — **deixe desmarcado**
- [ ] Allow deletions — **deixe desmarcado**

---

## Importante: os checks só aparecem depois de rodarem uma vez

O GitHub só lista um status check na tela de proteção depois que ele
executou pelo menos uma vez naquele repositório. Ordem correta:

1. Faça o merge (ou push) que traz `.github/workflows/` para a `main`.
2. Abra um PR qualquer e deixe o CI rodar até o fim.
3. Só então aplique a proteção — os nomes já estarão disponíveis.

---

## CodeRabbit

1. Instale o app: <https://github.com/apps/coderabbitai> → *Add repository*
   → selecione `gestao-condominio-app`.
2. O `.coderabbit.yaml` na raiz já configura o comportamento — não precisa
   mexer no painel.
3. Com `request_changes_workflow: true`, o CodeRabbit marca *Request
   changes* ao encontrar problema sério. Junto com
   `required_conversation_resolution`, isso segura o merge até você
   responder ou resolver cada apontamento.

Comandos úteis no PR: `@coderabbitai review`, `@coderabbitai resolve`,
`@coderabbitai configuration`.
