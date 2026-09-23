#!/usr/bin/env python3
"""Generate static Swedish pages in /sv/ from the English source pages.

English pages are the source of truth. After editing any English page or its
Swedish strings (PAGE_I18N.sv in the page, SHARED_I18N.sv in nav.js), run:
    python3 _tools/build_sv.py
"""
import json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://stormiestudios.com/"
PAGES = {  # file -> (sv title, sv meta description)
    "index.html": ("Hemsidor för gym, PT och träningsföretag | Stormie Studios",
        "Skräddarsydda hemsidor för gym, kampsportsklubbar, personliga tränare och träningsvarumärken. Byggda för fler medlemmar och helt förvaltade. Stockholm."),
    "about.html": ("Om Storm Kolmodin | Stormie Studios",
        "Storm Kolmodin är licensierad personlig tränare, agil projektledare och webbutvecklare bakom Stormie Studios, som bygger hemsidor för gym och tränare."),
    "what-you-get.html": ("Vad ni får | Stormie Studios",
        "En skräddarsydd hemsida som ni enkelt uppdaterar själva, med hosting, säkerhet, backup och underhåll för en fast månadsavgift. Er domän och ert innehåll är era."),
    "who-i-work-with.html": ("Hemsidor för gym, kampsportsklubbar och PT | Stormie Studios",
        "Hemsidor för gym, kampsportsklubbar, personliga tränare, coacher och träningsvarumärken. Byggda kring hur ni tränar, coachar och växer."),
}

def en_url(f): return BASE + ("" if f == "index.html" else f)
def sv_url(f): return BASE + "sv/" + ("" if f == "index.html" else f)

def extract_obj(src, marker):
    i = src.index(marker); i = src.index("{", i)
    depth, j, q = 0, i, None
    while True:
        c = src[j]
        if q:
            if c == "\\": j += 1
            elif c == q: q = None
        elif c in "'\"`": q = c
        elif c == "{": depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0: break
        j += 1
    js = src[i:j + 1]
    out = subprocess.run(["node", "-e", "process.stdout.write(JSON.stringify(eval('('+require('fs').readFileSync(0,'utf8')+')')))"],
                         input=js, capture_output=True, text=True, check=True).stdout
    return json.loads(out)

def mask_scripts(s):
    spans = [(m.start(), m.end()) for m in re.finditer(r"<script[\s\S]*?</script>", s)]
    return spans

def in_spans(i, spans): return any(a <= i < b for a, b in spans)

def replace_i18n(s, d):
    missing = set()
    out, pos = [], 0
    spans = mask_scripts(s)
    for m in re.finditer(r'<([a-zA-Z0-9]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>', s):
        if in_spans(m.start(), spans) or m.start() < pos: continue
        tag, key = m.group(1).lower(), m.group(2)
        if tag in ("input", "img", "br", "meta"): continue
        # find matching close tag
        depth, k = 1, m.end()
        pat = re.compile(r"<(/?)%s\b[^>]*?(/?)>" % tag, re.I)
        while depth:
            n = pat.search(s, k)
            if not n: break
            if n.group(1): depth -= 1
            elif not n.group(2): depth += 1
            k = n.end()
        close_start = n.start()
        if key in d:
            out.append(s[pos:m.end()]); out.append(d[key]); pos = close_start
        else:
            missing.add(key)
    out.append(s[pos:])
    return "".join(out), missing

def fix_paths(s):
    def rel(url):
        if re.match(r"^(https?:|mailto:|tel:|#|data:|/|javascript:)", url): return url
        name = url.split("#")[0].split("?")[0]
        if name in PAGES: return url            # sibling Swedish page
        return "/" + url                         # asset or English-only page
    s = re.sub(r'(\b(?:href|src|poster)=")([^"]*)(")', lambda m: m.group(1) + rel(m.group(2)) + m.group(3), s)
    s = re.sub(r"url\((['\"]?)([^)'\"]+)\1\)", lambda m: "url(" + m.group(1) + rel(m.group(2)) + m.group(1) + ")", s)
    return s

def alternates(f):
    return ('<link rel="alternate" hreflang="en" href="%s">\n<link rel="alternate" hreflang="sv" href="%s">\n'
            '<link rel="alternate" hreflang="x-default" href="%s">\n') % (en_url(f), sv_url(f), en_url(f))

def main():
    nav = open(os.path.join(ROOT, "nav.js"), encoding="utf-8").read()
    shared = extract_obj(nav, "var SHARED_I18N")["sv"]
    os.makedirs(os.path.join(ROOT, "sv"), exist_ok=True)
    report = {}
    for f, (title, desc) in PAGES.items():
        path = os.path.join(ROOT, f)
        s = open(path, encoding="utf-8").read()
        # make sure the English source carries hreflang alternates
        if 'hreflang="sv"' not in s:
            s = s.replace('<link rel="canonical"', alternates(f) + '<link rel="canonical"', 1)
            open(path, "w", encoding="utf-8").write(s)
        page = extract_obj(s, "window.PAGE_I18N").get("sv", {}) if "window.PAGE_I18N" in s else {}
        d = dict(shared); d.update(page)
        sv, missing = replace_i18n(s, d)
        report[f] = sorted(missing)
        sv = sv.replace('<html lang="en">', '<html lang="sv">', 1)
        sv = re.sub(r"<title>.*?</title>", "<title>%s</title>" % title.replace("&", "&amp;"), sv, 1)
        sv = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % desc, sv, 1)
        sv = re.sub(r'<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="%s">' % desc, sv, 1)
        sv = re.sub(r'<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="%s">' % title.replace("&", "&amp;"), sv, 1)
        sv = re.sub(r'<meta property="og:url" content="[^"]*">', '<meta property="og:url" content="%s">' % sv_url(f), sv, 1)
        sv = sv.replace('<meta property="og:type"', '<meta property="og:locale" content="sv_SE">\n<meta property="og:type"', 1)
        sv = re.sub(r'<link rel="canonical" href="[^"]*">', '<link rel="canonical" href="%s">' % sv_url(f), sv, 1)
        # structured data: Swedish page entity pointing at the shared studio/person ids
        page_type = "ProfilePage" if f == "about.html" else "WebPage"
        ent = {"@type": page_type, "@id": sv_url(f) + "#page", "url": sv_url(f), "name": title,
               "description": desc, "inLanguage": "sv", "isPartOf": {"@id": BASE + "#website"}}
        ent["mainEntity" if f == "about.html" else "about"] = {"@id": BASE + ("#storm" if f == "about.html" else "#studio")}
        ld = json.dumps({"@context": "https://schema.org", "@graph": [ent]}, ensure_ascii=False, indent=1)
        sv = re.sub(r'<script type="application/ld\+json">[\s\S]*?</script>',
                    lambda m: '<script type="application/ld+json">\n' + ld + '\n</script>', sv, 1)
        sv = fix_paths(sv)
        sv = sv.replace("<!DOCTYPE html>", "<!DOCTYPE html>\n<!-- GENERATED by _tools/build_sv.py from /%s. Do not edit by hand. -->" % f, 1)
        open(os.path.join(ROOT, "sv", f), "w", encoding="utf-8").write(sv)
    for f, miss in report.items():
        if miss: print("%s: no Swedish string for %s" % (f, ", ".join(miss)))
    print("built", len(PAGES), "Swedish pages")

if __name__ == "__main__":
    main()
