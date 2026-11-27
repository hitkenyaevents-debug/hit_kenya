"""Generate legal pages and shared footer from source. Run on the site root with Python 3.
Existing pages are edited only in their first (main) footer. Re-running updates the shared footer.
"""
from pathlib import Path
import re, json, html, sys
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parent.parent
src=root/'legal-source'
ft=(src/'footer.html').read_text().strip(); layout=(src/'layout.html').read_text(); policies=json.loads((src/'policies.json').read_text()); extra=(src/'footer-extra.html').read_text()
def footer(prefix,home=False):
    x=extra.replace('{{ROOT}}',prefix)
    if home: x+=(src/'homepage-extra.html').read_text()
    return ft.replace('{{ROOT}}',prefix).replace('{{EXTRA}}',x)
def replace_first_footer(s,f):
    # Original primary footer has nested details, but not nested footer elements.
    return re.sub(r'<footer\b[^>]*>.*?</footer>',lambda m:f,s,count=1,flags=re.S|re.I)
for name in ['index.html','about.html','partnerships.html']:
    p=root/name
    if not p.exists():continue
    s=p.read_text();s=replace_first_footer(s,footer('./',name=='index.html'))
    if name=='index.html':
        s=re.sub(r'<!-- HIT KENYA Google Analytics -->\s*<script async src="https://www\.googletagmanager\.com/gtag/js\?id=G-ELBKENXSKX"></script>\s*<script>window\.dataLayer=.*?</script>', '',s,count=1,flags=re.S)
    if 'assets/legal/shared.css' not in s:
        addition='<link rel="stylesheet" href="assets/legal/shared.css"><script defer src="assets/legal/consent.js" data-root="./"'+(' data-analytics="G-ELBKENXSKX"' if name=='index.html' else '')+'></script>'
        s=s.replace('</head>',addition+'\n</head>',1)
    p.write_text(s)
for slug,obj in policies.items():
    toc=[]; body=[]
    for i,(title,content) in enumerate(obj['sections'],1):
        ident=f'section-{i}';heading=f'{i}. {title}';toc.append(f'<a href="#{ident}">{html.escape(heading)}</a>');body.append(f'<section id="{ident}"><h2>{html.escape(heading)}</h2>{content}</section>')
    s=layout
    for k,v in {'TITLE':html.escape(obj['title']),'SUMMARY':html.escape(obj['summary'],quote=True),'TOC':''.join(toc),'CONTENT':'\n'.join(body),'SLUG':slug,'FOOTER':footer('../')}.items():s=s.replace('{{'+k+'}}',v)
    p=root/slug/'index.html';p.parent.mkdir(exist_ok=True);p.write_text(s)
