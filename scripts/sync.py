"""Build the public portfolio from the private brand pages in the POS repo (read-only source).

What it does:
  1. Reads the generated brand book + Khao Hom content and the UI kit from ../New App Test/brand-book.
  2. Redacts: every download, the asset kit, Khao Hom drafts / open fixes / research sources,
     halal-JAKIM notes and merch drop counts; and trims the menu to the 4 sample dishes.
  3. Copies only the images the pages show. Vector masters (SVG) are rasterised to WebP,
     so the editable logo files never leave the private repo.
Run:  py scripts/sync.py   (then npm run build)
"""
import json, re, shutil, subprocess, time
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(r"C:\Users\MOVING WELLS\New App Test\brand-book")
PUB = ROOT / "public"
RENDER = ROOT / "scripts" / ".render"
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

def load(p):
    s = (SRC / p).read_text(encoding="utf8")
    return {m.group(1): json.loads(m.group(2)) for m in re.finditer(r"^export const (\w+) = (.*)$", s, re.M)}

def drop_section(h, sid):
    return re.sub(rf'<section class="reveal wrap" id="{sid}">.*?</section>', "", h, flags=re.S)

def drop_toc(h, sid):
    return re.sub(rf'<a href="#{sid}">[^<]*</a>', "", h)

def unlink_downloads(h):
    # any remaining link to a file becomes plain text
    return re.sub(r'<a href="/[^"]+\.(?:zip|pdf|json|css|html|svg|png)"[^>]*>(.*?)</a>', r"\1", h, flags=re.S)

# ---------------------------------------------------------------- brand book
b = load("app/brand/content.ts")
bh = b["HTML"]
bh = drop_section(bh, "kit"); bh = drop_toc(bh, "kit")
bh = re.sub(r'<div class="forbid">.*?</div>', "", bh, flags=re.S)                  # halal / JAKIM / claims box
bh = re.sub(r"<li>(?:(?!</li>).)*?\b35\b(?:(?!</li>).)*</li>", "", bh, flags=re.S)   # list items about the 35-piece drops
bh = bh.replace(', "07 OF 35"', "").replace(", the 35-piece story", "").replace("One drop = 35 pieces, one for every table in the restaurant.", "")
bh = re.sub(r"[^.>]*\b(?:halal|JAKIM)\b[^.<]*\.?", "", bh, flags=re.I)
bh = unlink_downloads(bh)

# ---------------------------------------------------------------- Khao Hom
k = load("app/khao-hom/content.ts")
kh = k["HTML"]
kh = re.sub(r'<div class="draft">.*?</div>', "", kh, flags=re.S)
kh = re.sub(r'<p class="mini">OPEN FIXES</p><ul class="neg">.*?</ul>', "", kh, flags=re.S)
kh = re.sub(r'<p class="mini">RESEARCH SOURCES</p><ul class="rules">.*?</ul>', "", kh, flags=re.S)
kh = drop_section(kh, "downloads"); kh = drop_toc(kh, "downloads")
kh = kh.replace("Character sheet · v1.0 draft · for AI video", "Character sheet · for AI video")
kh = kh.replace(", voice and a ready-made reference pack.", " and voice.")
kh = kh.replace('class="tile off"', 'class="tile"')
kh = re.sub(r"Poses outlined in chili red are off-model and due for a redraw\.", "", kh)
kh = unlink_downloads(kh)
# drop the off-model poses from the public grid
kh = re.sub(r'<figure class="tile[^"]*"><div class="pic"><img src="/khao-hom/img/poses/\d\d-(?:pointing|sleeping)\.webp".*?</figure>', "", kh, flags=re.S)

for name in ["Rif", "draft", "DRAFT", "approval", ".zip", "JAKIM", "halal"]:
    for h, label in [(bh, "brand"), (kh, "khao-hom")]:
        if name.lower() in h.lower():
            print(f"  note: '{name}' still appears in {label}")

# ---------------------------------------------------------------- assets: copy only what is shown; rasterise SVG
if PUB.exists():
    shutil.rmtree(PUB)
PUB.mkdir(parents=True)
RENDER.mkdir(parents=True, exist_ok=True)

def raster_svg(svg: Path, out: Path, long_side=1600):
    vb = re.search(r'viewBox="([-\d. ]+)"', svg.read_text(encoding="utf8"))
    vw, vh = (float(x) for x in vb.group(1).split()[2:]) if vb else (1, 1)
    k_ = long_side / max(vw, vh)
    w, h = max(1, round(vw * k_)), max(1, round(vh * k_))
    html = RENDER / "r.html"
    html.write_text(f'<html><body style="margin:0;background:transparent"><img src="{svg.resolve().as_uri()}" width="{w}" height="{h}" style="display:block"></body></html>')
    png = RENDER / "r.png"
    if png.exists():
        png.unlink()
    subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--user-data-dir={RENDER / 'prof'}",
                    f"--window-size={w},{h}", "--default-background-color=00000000", "--virtual-time-budget=2000",
                    f"--screenshot={png}", html.as_uri()], capture_output=True, timeout=60)
    for _ in range(60):
        if png.exists() and png.stat().st_size > 0:
            break
        time.sleep(0.25)
    time.sleep(0.2)
    out.parent.mkdir(parents=True, exist_ok=True)
    Image.open(png).convert("RGBA").crop((0, 0, w, h)).save(out, "WEBP", quality=90, method=6)

mapping = {}
def publish(ref: str) -> str:
    """ref = '/brand/x.svg' etc. Returns the public path the portfolio uses."""
    if ref in mapping:
        return mapping[ref]
    src = SRC / "public" / ref.lstrip("/")
    if not src.exists():
        print("  missing:", ref); mapping[ref] = ref; return ref
    if src.suffix == ".svg":
        new = ref[:-4] + ".webp"
        raster_svg(src, PUB / new.lstrip("/"))
    elif src.suffix == ".png":
        new = ref[:-4] + ".webp"
        im = Image.open(src); im.thumbnail((1600, 1600))
        (PUB / new.lstrip("/")).parent.mkdir(parents=True, exist_ok=True)
        im.save(PUB / new.lstrip("/"), "WEBP", quality=88, method=6)
    else:
        new = ref
        (PUB / new.lstrip("/")).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(src, PUB / new.lstrip("/"))
    mapping[ref] = new
    return new

def rewrite(h):
    return re.sub(r'((?:src|href)=")(/(?:brand|khao-hom)/[^"]+)"', lambda m: m.group(1) + publish(m.group(2)) + '"', h)

bh, kh = rewrite(bh), rewrite(kh)

def write_content(dest, d, html):
    (ROOT / "app" / dest).mkdir(parents=True, exist_ok=True)
    (ROOT / "app" / dest / "content.ts").write_text(
        "// GENERATED by scripts/sync.py from the private brand pages (redacted). Do not edit by hand.\n"
        f"export const CSS = {json.dumps(d['CSS'])}\nexport const HTML = {json.dumps(html, ensure_ascii=False)}\n", encoding="utf8")
write_content("brand", b, bh)
write_content("khao-hom", k, kh)

# ---------------------------------------------------------------- UI kit (code copy, sample data only)
shutil.copy(SRC / "app" / "ui-kit" / "page.tsx", ROOT / "app" / "ui-kit" / "page.tsx")
shutil.copy(SRC / "app" / "kit" / "kit.css", ROOT / "app" / "kit" / "kit.css")
ui = (SRC / "app" / "kit" / "ui.tsx").read_text(encoding="utf8")
ui = ui.replace("src={`/brand/jaosamut-${name}.svg`}", "src={`/brand/jaosamut-${name}.webp`}")
(ROOT / "app" / "kit" / "ui.tsx").write_text(ui, encoding="utf8")
page = (ROOT / "app" / "ui-kit" / "page.tsx").read_text(encoding="utf8")
# strip internal project references from the public copy
page = page.replace("Stage 1 · Product design system", "Product design system")
page = re.sub(r"\s*The rules behind it are in <span className=\"mono\">docs/04-DESIGN-SYSTEM\.md</span>\.", "", page)
page = page.replace("SAMPLE · flags and add-ons until Stage 3", "SAMPLE · illustrative flags and add-ons")
(ROOT / "app" / "ui-kit" / "page.tsx").write_text(page, encoding="utf8")
for word in ["Stage ", "docs/"]:
    if word in page:
        print(f"  note: '{word}' still appears in ui-kit")
used = sorted(set(re.findall(r"dish\('([^']+)'\)", page)))
logos = sorted(set(re.findall(r"Logo[^>]*name=['\"]([^'\"]+)['\"]", page + ui))) or ["primary-green"]
if "primary-green" not in logos:
    logos.append("primary-green")
for name in logos:
    publish(f"/brand/jaosamut-{name}.svg")
publish("/khao-hom/img/expressions-1/05-cheeky.webp")
menu = json.loads((SRC / "app" / "kit" / "menu.json").read_text(encoding="utf8"))
keep = []
for c in menu["categories"]:
    items = [i for i in c["items"] if any(i["name"].lower().startswith(u.lower()) for u in used)]
    for i in items:
        for g in i["groups"]:
            if g.get("pickWhy"):
                g["pickWhy"] = "Khao Hom's suggestion"
    if items:
        keep.append({**c, "items": items})
menu = {"source": "sample", "sample": "Sample dishes for the UI kit", "categories": keep}
(ROOT / "app" / "kit" / "menu.json").write_text(json.dumps(menu, ensure_ascii=False, indent=1), encoding="utf8")

# favicon / social image
publish("/brand/png/jaosamut-favicon-32.png"); publish("/brand/png/jaosamut-app-icon-180.png")
print(f"ok · {len(mapping)} assets · dishes kept: {sum(len(c['items']) for c in keep)} · logos: {logos}")
