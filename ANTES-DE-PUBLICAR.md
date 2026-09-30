# Antes de publicar

## 1. Preencher (js/config.js → NEGOCIO)
- [ ] CNPJ/MEI e nome do negócio
- [ ] Horário de atendimento
- [ ] Formas de pagamento (Pix, cartão…)
- [ ] Entrega e retirada (área, taxa)
- [ ] Cardápio pela planilha: siga o `GUIA-PLANILHA.md` e cole o link em `GOOGLE_SHEETS_CSV` (opcional)
- [ ] Conferir preços e itens do cardápio (planilha e, como plano B, `MENU` no `config.js`), e as etiquetas ("Queridinho", "Mais pedido", "Novidade")

## 2. Conferir
- [ ] O aviso de alergias no cardápio está correto para os seus produtos
- [ ] Você tem autorização das pessoas que aparecem nas fotos da Estação (`galeria-03`, `galeria-04`)
- [ ] Depoimentos: só adicione em `DEPOIMENTOS` os que forem reais e autorizados

## 3. Colocar no ar
Hospedagem gratuita para site estático: Netlify, Cloudflare Pages, Vercel ou GitHub Pages. Envie a pasta inteira.
Domínio: registro.br (.com.br).

## 4. Depois que o domínio estiver ativo
1. Rode `python3 definir-dominio.py seudominio.com.br` e envie os arquivos alterados de novo.
2. Google Search Console: verifique o domínio e envie `https://seudominio.com.br/sitemap.xml`.
3. Perfil da Empresa no Google: categoria "Doceria" (ou similar), telefone, horário, área de atendimento, fotos e link do site. Se os clientes não vão até o endereço, use área de atendimento em vez de mostrar endereço residencial.
4. Coloque o link do site no Instagram e no iFood.
