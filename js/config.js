// =====================================================================
// CONFIGURAÇÕES PRINCIPAIS — é aqui que você altera o site.
// Depois de editar, salve e envie os arquivos de novo para a hospedagem.
// =====================================================================

// WhatsApp com DDI + DDD + número, só dígitos.
const WHATSAPP = "5511933307668";

const IFOOD_URL = "https://www.ifood.com.br/delivery/aruja-sp/micklu-chocolates-parque-rodrigo-barreto/5e67d6e4-8705-4771-a96b-412afe380adf";

// Dados do negócio. Campos vazios ("") não aparecem no site.
// Preencha o que se aplica: dá confiança ao cliente e é boa prática para venda online.
const NEGOCIO = {
  razaoOuNome: "",   // Ex.: nome ou razão social
  cnpj: "",          // Ex.: "00.000.000/0001-00"
  horario: "",       // Ex.: "Seg a sáb, das 9h às 18h"
  pagamento: "",     // Ex.: "Pix, cartão de crédito e débito"
  entrega: "",       // Ex.: "Entrega em Arujá; retirada combinada pelo WhatsApp"
  observacaoCardapio: "A disponibilidade dos produtos varia diariamente. Consulte o cardápio do dia pelo WhatsApp ou iFood."
};

// Cardápio ligado a uma planilha do Google (opcional).
// Cole aqui o link CSV publicado da planilha (veja GUIA-PLANILHA.md).
// Vazio ("") = o site usa a lista MENU abaixo.
// Se a planilha estiver configurada mas não carregar, o site usa a última cópia
// salva no navegador do cliente ou, na falta dela, a lista MENU abaixo.
const GOOGLE_SHEETS_CSV = "";

// Cardápio reserva (usado quando não há planilha ou ela não carrega). Para pausar um item, use disponivel:false.
// "tag" é a etiqueta pequena acima do nome (deixe "" para não mostrar).
// Fotos: coloque o arquivo em images/produtos/ e troque o caminho em "foto".
const MENU = [
  {nome:"Trufas",descricao:"Trufas artesanais preparadas com o cuidado e o sabor da Micklu.",foto:"images/galeria/galeria-05.webp",alt:"Trufas artesanais Micklu",tag:""},
  {nome:"Cone trufado",descricao:"Cone crocante com recheios artesanais e combinações especiais.",foto:"images/galeria/galeria-05.webp",alt:"Cone trufado Micklu",tag:""},
  {nome:"Pão de mel",descricao:"Pão de mel artesanal, um clássico que faz parte da história da Micklu.",foto:"images/produtos/morango-chocolate.webp",alt:"Pão de mel Micklu",tag:""},
  {nome:"Brownie",descricao:"Brownie artesanal com sabor intenso de chocolate.",foto:"images/novas/brownie-novo.webp",alt:"Brownie artesanal Micklu",tag:""},
  {nome:"Brigadeiros gourmet",descricao:"Brigadeiros gourmet preparados em diferentes sabores e combinações.",foto:"images/novas/doces-gourmet.webp",alt:"Brigadeiros gourmet Micklu",tag:""},
  {nome:"Cookies",descricao:"Cookies artesanais com recheios e combinações especiais.",foto:"images/novas/cookie-recheado.webp",alt:"Cookies artesanais Micklu",tag:""},
  {nome:"Doces gourmet",descricao:"Seleção de doces artesanais para diferentes momentos e celebrações.",foto:"images/novas/doces-gourmet.webp",alt:"Doces gourmet Micklu",tag:""},
  {nome:"Sobremesas especiais",descricao:"Sobremesas especiais preparadas com combinações da casa.",foto:"images/novas/sobremesas-potes.webp",alt:"Sobremesas especiais Micklu",tag:""},
  {nome:"Lembrancinhas",descricao:"Opções artesanais para presentear e tornar cada ocasião mais especial.",foto:"images/novas/lembrancinhas-personalizadas.webp",alt:"Lembrancinhas Micklu",tag:""},
  {nome:"Sorvetes artesanais",descricao:"Sorvetes artesanais Micklu. Consulte os sabores disponíveis no dia.",foto:"images/novas/copo-morango.webp",alt:"Sorvetes artesanais Micklu",tag:""}
];

// Fotos do carrossel (caminho, texto alternativo e legenda).
const GALLERY = [
  {src:"images/novas/cookie-recheado.webp",alt:"Cookie artesanal recheado com chocolate",legenda:"Cookies artesanais"},
  {src:"images/novas/sobremesa-travessa.webp",alt:"Sobremesa especial com chocolate e morangos",legenda:"Sobremesas especiais"},
  {src:"images/novas/morango-chocolate-branco.webp",alt:"Morango especial coberto com chocolate branco",legenda:"Feito à mão"},
  {src:"images/novas/doces-gourmet.webp",alt:"Caixa de doces gourmet Micklu",legenda:"Doces gourmet"},
  {src:"images/novas/cookie-red-velvet.webp",alt:"Cookie red velvet recheado",legenda:"Sabores especiais"},
  {src:"images/novas/estacao-carrinho.webp",alt:"Carrinho rosa da Estação Micklu",legenda:"Estação Micklu"}
];

// Depoimentos REAIS de clientes. Enquanto a lista estiver vazia, a seção não aparece.
// Peça autorização ao cliente antes de publicar. Exemplo:
// {texto:"Texto que o cliente escreveu.", autor:"Ana S., aniversário"}
const DEPOIMENTOS = [];
