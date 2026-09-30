#!/usr/bin/env python3
"""Define o domínio do site: canonical, og:url, og:image, JSON-LD, sitemap.xml e robots.txt.

Uso:  python3 definir-dominio.py seudominio.com.br
Rode UMA vez quando o domínio estiver ativo (pode rodar de novo para trocar de domínio).
"""
import json, re, sys, datetime, pathlib

if len(sys.argv) != 2:
    sys.exit("Uso: python3 definir-dominio.py seudominio.com.br")

dominio = re.sub(r"^https?://", "", sys.argv[1].strip()).strip("/")
if not re.fullmatch(r"[a-z0-9.-]+\.[a-z]{2,}", dominio, re.I):
    sys.exit(f"Domínio inválido: {dominio}")
base = f"https://{dominio}"
raiz = pathlib.Path(__file__).parent

# 1) index.html: bloco de meta tags + JSON-LD
p = raiz / "index.html"
html = p.read_text(encoding="utf-8")
bloco = (
    "<!-- DOMINIO:INICIO -->\n"
    f'<link rel="canonical" href="{base}/">\n'
    f'<meta property="og:url" content="{base}/">\n'
    f'<meta property="og:image" content="{base}/images/marca/og.jpg">\n'
    '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">\n'
    '<meta name="twitter:card" content="summary_large_image">\n'
    "<!-- DOMINIO:FIM -->"
)
html, n = re.subn(r"<!-- DOMINIO:INICIO -->.*?<!-- DOMINIO:FIM -->", lambda m: bloco, html, flags=re.S)
if n != 1:
    sys.exit("Marcadores DOMINIO:INICIO/FIM não encontrados no index.html")

def patch_ld(m):
    dados = json.loads(m.group(2))
    dados["url"] = f"{base}/"
    dados["image"] = f"{base}/images/marca/og.jpg"
    return m.group(1) + json.dumps(dados, ensure_ascii=False, separators=(",", ":")) + m.group(3)

html, n = re.subn(r'(<script type="application/ld\+json" id="ld-negocio">)(.*?)(</script>)', patch_ld, html, flags=re.S)
if n != 1:
    sys.exit("Bloco JSON-LD id=ld-negocio não encontrado")
p.write_text(html, encoding="utf-8")

# 2) sitemap.xml e robots.txt
hoje = datetime.date.today().isoformat()
(raiz / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    f"<url><loc>{base}/</loc><lastmod>{hoje}</lastmod></url></urlset>\n",
    encoding="utf-8",
)
(raiz / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {base}/sitemap.xml\n", encoding="utf-8")

print(f"Pronto: {base}/ configurado (canonical, og:url, og:image, JSON-LD, sitemap.xml e robots.txt).")
