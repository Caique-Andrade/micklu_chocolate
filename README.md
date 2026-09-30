# Micklu Chocolates — site

Site estático (HTML, CSS e JavaScript), sem servidor e sem banco de dados.

## Onde mexer
- `js/config.js`: WhatsApp, iFood, **cardápio**, fotos do carrossel, dados do negócio (CNPJ, horário, pagamento, entrega) e depoimentos.
- `index.html`: textos das seções.
- `css/style.css`: visual.
- `images/`: fotos em WebP (já otimizadas). Para trocar uma foto, coloque o arquivo novo em `images/produtos/` ou `images/galeria/` e ajuste o caminho no `config.js`. Use largura de ~900 px.

## Atualizar o cardápio
Recomendado: pela planilha do Google, sem reenviar arquivos. Veja `GUIA-PLANILHA.md` (modelo em `modelo-cardapio.csv`).
Sem planilha, o site usa a lista `MENU` em `js/config.js` (para pausar um item, `disponivel:false`); nesse caso, reenvie o arquivo para a hospedagem após editar.

## Testar no computador
Abra a pasta no VS Code e rode `index.html` com a extensão Live Server.

## Publicar
Veja `ANTES-DE-PUBLICAR.md`.


## V2
Atualizada conforme feedback da Micklu: portfólio sem preços, prazos de encomenda, história da marca, Estação Micklu, datas especiais e layout mobile-first.
