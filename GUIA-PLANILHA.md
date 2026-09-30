# Cardápio pela planilha do Google

Com isso você muda preço, descrição e disponibilidade direto na planilha, sem mexer no código nem reenviar arquivos.

## 1. Criar a planilha (uma vez)
1. No Google Planilhas: **Arquivo → Importar → Upload** e escolha `modelo-cardapio.csv`. Escolha "Substituir planilha".
2. Não mude os nomes das colunas da primeira linha: `nome`, `descricao`, `preco`, `foto`, `alt`, `disponivel`, `tag`.

## 2. Publicar como CSV (uma vez)
1. **Arquivo → Compartilhar → Publicar na Web**.
2. Em "Link", escolha a aba do cardápio e o formato **Valores separados por vírgula (.csv)**. Clique em **Publicar**.
3. Copie o link gerado e cole em `js/config.js`:
   `const GOOGLE_SHEETS_CSV = "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv";`
4. Envie o `config.js` de novo para a hospedagem.

Atenção: "Publicar na Web" deixa o conteúdo dessa aba público para quem tiver o link. Use uma planilha só para o cardápio e não coloque dados de clientes nela.

## 3. Como preencher
| Coluna | O que colocar |
|---|---|
| nome | Nome do item (linha sem nome é ignorada) |
| descricao | Descrição curta |
| preco | `R$ 12,00`, ou só `12`. Vazio = "Sob consulta" |
| foto | Caminho da foto no site, ex.: `images/produtos/brownie.webp`. Vazio = sem foto |
| alt | Descrição da foto para acessibilidade (opcional) |
| disponivel | `sim` ou `não`. Também vale caixa de seleção (marcada/desmarcada). Vazio = disponível |
| tag | Etiqueta pequena, ex.: `Novidade` (opcional) |

A ordem das linhas é a ordem no site.

## 4. Fotos novas
A planilha só guarda o caminho. Para item novo com foto: coloque a foto (WebP, ~900 px de largura) em `images/produtos/`, envie para a hospedagem e escreva o caminho na coluna `foto`. Também funciona um link `https://...` de imagem.

## Bom saber
- As mudanças levam alguns minutos para aparecer (o Google atualiza o CSV publicado com pequeno atraso).
- Se a planilha sair do ar, o site mostra a última cópia salva no navegador do cliente ou, na falta dela, o cardápio reserva (`MENU` no `config.js`). Mantenha o `MENU` atualizado como plano B.
