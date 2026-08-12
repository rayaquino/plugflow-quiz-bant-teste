# Migrar o case odonto (foto + selo) para o Lovable

Material pronto para o `plugflow-quiz-bant-2-2` aplicar **depois** que o publish de hoje passar.
Preparado sem tocar na aba do Lovable. Nada aqui foi aplicado.

## O que falta subir

O commit `0871e8e` existe só no repo local. Conferido por busca no projeto Lovable
`531a0cde`: "No results" para `imagem ilustrativa` e para `clinica`. São duas coisas:

1. `src/components/scenes/Scene4Case.tsx` com a foto de fundo e o selo `· imagem ilustrativa`
2. A imagem em si, hoje `public/clinica.jpg` (1400px, 135 KB)

O item 1 é texto e cola sem drama. O item 2 é binário, e o fluxo do
`ATUALIZAR-LOVABLE.md` só serve para texto colado. É esse o problema real.

## Decisão: tenta a rota A, cai na B se não der

### Rota A (preferida): subir a imagem como arquivo no `public/` do Lovable

Se der para colocar um binário no `public/` do projeto (anexo no chat do Lovable
ou qualquer upload nativo que exista na UI), **essa é a melhor saída de longe**,
porque o código não muda em nada:

- Sobe a imagem como `public/clinica.jpg`
- Cola `src/components/scenes/Scene4Case.tsx` **exatamente como está no repo local**,
  sem nenhuma modificação. Ele já aponta para `/clinica.jpg`.
- Custo no bundle: zero. A foto vira requisição separada e cacheável.

Use `docs/migracao-case/clinica-otim.jpg` (700px, 34.788 bytes) em vez do original
de 135 KB. Ela renderiza com ~490px de largura e ainda vai a 42% de opacidade sob
gradiente, então a diferença é invisível: RMSE 2,3 de 255 no tamanho de render, e
~1 de 255 depois da opacidade. Só renomeie para `clinica.jpg` ao subir.

Não testei essa rota porque não tenho acesso à aba. Se o upload exigir que a IA do
Lovable mexa em arquivo, **confira depois se ela alterou só o que devia**, porque o
histórico deste projeto é ela fazer meio serviço.

### Rota B (fallback, verificada): embutir a foto em base64

Se não houver jeito de subir binário, os arquivos prontos estão aqui:

- `docs/migracao-case/fotoCase.ts` → cola como `src/lib/fotoCase.ts` no Lovable
- `docs/migracao-case/Scene4Case.tsx` → cola como `src/components/scenes/Scene4Case.tsx`

A diferença do Scene4Case para o original do repo é de duas linhas só:

```diff
 import { motion } from 'framer-motion'
+import { FOTO_CASE } from '@/lib/fotoCase'
@@
-            src="/clinica.jpg"
+            src={FOTO_CASE}
```

**Verificado**: rodei `npm run build` com esses dois arquivos aplicados e passou
(404 módulos, tsc + vite, sem erro). Depois restaurei o repo, que está limpo.

**Custo honesto desta rota**, medido no build:

| | raw | gzip |
|---|---|---|
| bundle JS hoje | 292,82 kB | 94,44 kB |
| com a foto embutida | 339,22 kB | 131,93 kB |
| delta | +46,40 kB | +37,49 kB |

Base64 de JPEG quase não comprime, então os 37,5 kB de gzip entram inteiros no
bundle principal. E tem um agravante: a cena 4 só aparece depois do lead responder
3 perguntas, ou seja, a foto **não é caminho crítico**. Embutir no bundle faz ela
carregar logo de cara, quando ninguém ainda vai ver. É pior que a rota A em
performance, não só em elegância. Por isso é fallback, não empate.

`fotoCase.ts` tem 47.377 caracteres numa linha só. Não dá para digitar isso pelo
`type` do browser. Para colar no editor do Lovable, use clipboard
(`navigator.clipboard.writeText` via `javascript_tool` e depois `ctrl+v` no editor),
não digitação.

## Depois de aplicar, conferir

1. Busca por `imagem ilustrativa` no projeto Lovable tem que voltar 1 resultado
2. Busca por `Caso real` tem que continuar batendo com o selo ao lado
3. Abrir a cena 4 no preview e olhar a imagem de verdade, não a legenda
4. Se foi a rota B, conferir que `src/lib/fotoCase.ts` existe e que
   `src="/clinica.jpg"` não sobrou em lugar nenhum

## O que não fazer

- Não clicar em "Corrigir compilação" / "Try to fix"
- Não deixar a IA do Lovable reescrever o `Scene4Case.tsx`. Os comentários dentro
  dele são regra de compliance do case (não nomear o cliente, não inventar número
  de performance, não afirmar o que aconteceu com o time). Se ela reescrever,
  isso se perde e vira risco real, não perda de estilo.
- Não aumentar a imagem de novo sem motivo. Cada kB entra no bundle do cliente.
