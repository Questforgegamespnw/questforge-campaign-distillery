#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "../..");
const devRoot = path.join(projectRoot, "dev");
const wikiRoot = path.join(devRoot, "wiki");
const manifestPath = path.join(wikiRoot, "manifest.json");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const output = [];
  let paragraph = [];
  let listType = null;
  let inCode = false;
  let codeLang = "";
  let code = [];
  let quote = [];
  let tableRows = [];

  function flushParagraph() {
    if (paragraph.length) {
      output.push(`<p>${inline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  }

  function flushList() {
    if (listType) {
      output.push(`</${listType}>`);
      listType = null;
    }
  }

  function flushQuote() {
    if (quote.length) {
      output.push(`<blockquote>${inline(quote.join(" "))}</blockquote>`);
      quote = [];
    }
  }

  function flushTable() {
    if (!tableRows.length) return;
    const rows = tableRows.map((line) =>
      line.split("|").slice(1, -1).map((cell) => cell.trim())
    );
    if (rows.length >= 2 && rows[1].every((cell) => /^:?-{3,}:?$/.test(cell))) {
      const head = rows[0];
      const body = rows.slice(2);
      output.push("<div class=\"table-wrap\"><table><thead><tr>" +
        head.map((cell) => `<th>${inline(cell)}</th>`).join("") +
        "</tr></thead><tbody>" +
        body.map((row) => "<tr>" +
          row.map((cell) => `<td>${inline(cell)}</td>`).join("") +
          "</tr>").join("") +
        "</tbody></table></div>");
    } else {
      for (const row of tableRows) paragraph.push(row);
    }
    tableRows = [];
  }

  for (const line of lines) {
    const fence = line.match(/^```(.*)$/);
    if (fence) {
      flushParagraph(); flushList(); flushQuote(); flushTable();
      if (!inCode) {
        inCode = true;
        codeLang = fence[1].trim();
      } else {
        output.push(`<pre><button class="copy-code">Copy</button><code data-lang="${escapeHtml(codeLang)}">${escapeHtml(code.join("\n"))}</code></pre>`);
        inCode = false; codeLang = ""; code = [];
      }
      continue;
    }

    if (inCode) {
      code.push(line);
      continue;
    }

    if (/^\|.*\|$/.test(line)) {
      flushParagraph(); flushList(); flushQuote();
      tableRows.push(line);
      continue;
    } else {
      flushTable();
    }

    if (!line.trim()) {
      flushParagraph(); flushList(); flushQuote();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph(); flushList(); flushQuote();
      const level = heading[1].length;
      const text = heading[2].trim();
      const id = text.toLowerCase()
        .replace(/<[^>]+>/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      output.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      continue;
    }

    const quoteMatch = line.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      flushParagraph(); flushList();
      quote.push(quoteMatch[1]);
      continue;
    }

    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    if (unordered) {
      flushParagraph(); flushQuote();
      if (listType !== "ul") {
        flushList();
        output.push("<ul>");
        listType = "ul";
      }
      output.push(`<li>${inline(unordered[1])}</li>`);
      continue;
    }

    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph(); flushQuote();
      if (listType !== "ol") {
        flushList();
        output.push("<ol>");
        listType = "ol";
      }
      output.push(`<li>${inline(ordered[1])}</li>`);
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      flushParagraph(); flushList(); flushQuote();
      output.push("<hr>");
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph(); flushList(); flushQuote(); flushTable();
  return output.join("\n");
}

function build() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const docs = manifest.map((entry, index) => {
    const filePath = path.join(devRoot, entry.file);
    const markdown = fs.readFileSync(filePath, "utf8");
    return {
      ...entry,
      id: `doc-${index}`,
      markdown,
      html: markdownToHtml(markdown),
      searchText: markdown.toLowerCase()
    };
  });

  const categories = [...new Set(docs.map((doc) => doc.category))];
  const nav = categories.map((category) => `
    <section class="nav-group">
      <button class="nav-group-title" type="button">${escapeHtml(category)}</button>
      <div class="nav-group-items">
        ${docs.filter((doc) => doc.category === category).map((doc) => `
          <button class="doc-link" data-doc="${doc.id}" type="button">
            <span>${escapeHtml(doc.title)}</span>
            <small>${escapeHtml(doc.status)}</small>
          </button>`).join("")}
      </div>
    </section>`).join("");

  const articles = docs.map((doc) => `
    <article id="${doc.id}" class="doc-page" data-title="${escapeHtml(doc.title)}" data-search="${escapeHtml(doc.searchText)}">
      <div class="doc-meta">
        <span>${escapeHtml(doc.category)}</span>
        <span class="status">${escapeHtml(doc.status)}</span>
      </div>
      ${doc.html}
      <div class="doc-pager">
        <button class="prev-doc" type="button">Previous</button>
        <button class="next-doc" type="button">Next</button>
      </div>
    </article>`).join("");

  const payload = JSON.stringify(docs.map(({id,title,category,status,searchText}) => ({id,title,category,status,searchText})));

  const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>QuestForge Developer Wiki</title>
<style>
:root{--bg:#17131d;--panel:#221b2b;--panel2:#2c2337;--ink:#f4eedf;--muted:#b8acbf;--gold:#c7a55b;--cream:#f7f0df;--text:#2c2630;--line:#4b3b58}
*{box-sizing:border-box}body{margin:0;font-family:Georgia,"Times New Roman",serif;background:var(--bg);color:var(--ink)}
button,input{font:inherit}.app{display:grid;grid-template-columns:330px 1fr;min-height:100vh}
.sidebar{position:sticky;top:0;height:100vh;overflow:auto;background:linear-gradient(180deg,var(--panel),#18131e);border-right:1px solid var(--line);padding:22px}
.brand{font-size:1.35rem;color:var(--gold);font-weight:bold}.subtitle{color:var(--muted);font-size:.9rem;margin:6px 0 18px}
.search{width:100%;padding:11px 12px;border-radius:8px;border:1px solid var(--line);background:#120f16;color:var(--ink);margin-bottom:16px}
.nav-group{margin:8px 0}.nav-group-title{width:100%;text-align:left;background:none;border:0;color:var(--gold);padding:8px 4px;font-weight:bold;cursor:pointer}
.nav-group-items{display:grid;gap:4px}.doc-link{display:flex;justify-content:space-between;gap:10px;text-align:left;border:0;border-radius:7px;background:transparent;color:var(--ink);padding:9px;cursor:pointer}
.doc-link:hover,.doc-link.active{background:var(--panel2)}.doc-link small{color:var(--muted)}
.content{padding:36px;min-width:0}.doc-page{display:none;max-width:1000px;margin:0 auto;background:var(--cream);color:var(--text);padding:42px 52px;border-radius:12px;box-shadow:0 18px 55px #0008}
.doc-page.active{display:block}.doc-meta{display:flex;justify-content:space-between;color:#6e6171;border-bottom:1px solid #d9ceb8;padding-bottom:12px;margin-bottom:24px}.status{color:#765c22}
h1,h2,h3,h4{color:#2f2636;scroll-margin-top:20px}h1{font-size:2.2rem;border-bottom:2px solid var(--gold);padding-bottom:12px}h2{margin-top:2rem}
a{color:#6c4d87}code{font-family:Consolas,monospace;background:#e9dfcb;padding:.1em .3em;border-radius:4px}
pre{position:relative;overflow:auto;background:#1f1926;color:#f8f1df;padding:18px;border-radius:8px}pre code{background:none;padding:0}.copy-code{position:absolute;right:8px;top:8px;background:#3d3049;color:#fff;border:1px solid #655075;border-radius:5px;padding:5px 8px;cursor:pointer}
blockquote{border-left:4px solid var(--gold);margin-left:0;padding:10px 18px;background:#efe4ce}.table-wrap{overflow:auto}table{border-collapse:collapse;width:100%}th,td{border:1px solid #cdbf9f;padding:8px;text-align:left}
.doc-pager{display:flex;justify-content:space-between;border-top:1px solid #d9ceb8;margin-top:36px;padding-top:18px}.doc-pager button{background:#35293e;color:#fff;border:0;border-radius:7px;padding:9px 14px;cursor:pointer}
.no-results{display:none;color:var(--muted);padding:10px}.mobile-toggle{display:none}
@media(max-width:850px){.app{display:block}.sidebar{position:fixed;z-index:10;left:-340px;width:320px;transition:left .2s}.sidebar.open{left:0}.mobile-toggle{display:block;position:fixed;z-index:11;top:10px;right:10px;background:var(--gold);border:0;border-radius:7px;padding:9px}.content{padding:58px 12px 20px}.doc-page{padding:28px 22px}}
</style>
</head>
<body>
<button class="mobile-toggle" type="button">Docs</button>
<div class="app">
<aside class="sidebar">
  <div class="brand">QuestForge Developer Wiki</div>
  <div class="subtitle">Campaign Distillery v0.9.1</div>
  <input id="search" class="search" type="search" placeholder="Search documentation">
  <div id="nav">${nav}</div>
  <div id="no-results" class="no-results">No matching documents.</div>
</aside>
<main class="content">${articles}</main>
</div>
<script>
const docs=${payload};
const links=[...document.querySelectorAll(".doc-link")];
const pages=[...document.querySelectorAll(".doc-page")];
const sidebar=document.querySelector(".sidebar");

function showDoc(id,push=true){
  pages.forEach(p=>p.classList.toggle("active",p.id===id));
  links.forEach(l=>l.classList.toggle("active",l.dataset.doc===id));
  if(push) history.replaceState(null,"","#"+id);
  window.scrollTo(0,0);
  sidebar.classList.remove("open");
}
function currentIndex(){return pages.findIndex(p=>p.classList.contains("active"))}
links.forEach(l=>l.addEventListener("click",()=>showDoc(l.dataset.doc)));
pages.forEach((page,index)=>{
  page.querySelector(".prev-doc").addEventListener("click",()=>showDoc(pages[Math.max(0,index-1)].id));
  page.querySelector(".next-doc").addEventListener("click",()=>showDoc(pages[Math.min(pages.length-1,index+1)].id));
});
document.querySelectorAll(".copy-code").forEach(btn=>btn.addEventListener("click",async()=>{
  const text=btn.parentElement.querySelector("code").innerText;
  await navigator.clipboard.writeText(text);
  btn.textContent="Copied";
  setTimeout(()=>btn.textContent="Copy",1200);
}));
document.getElementById("search").addEventListener("input",event=>{
  const q=event.target.value.trim().toLowerCase();
  let visible=0;
  links.forEach(link=>{
    const doc=docs.find(d=>d.id===link.dataset.doc);
    const match=!q||doc.title.toLowerCase().includes(q)||doc.category.toLowerCase().includes(q)||doc.searchText.includes(q);
    link.style.display=match?"flex":"none";
    if(match) visible++;
  });
  document.getElementById("no-results").style.display=visible?"none":"block";
});
document.querySelectorAll(".nav-group-title").forEach(btn=>btn.addEventListener("click",()=>{
  const items=btn.nextElementSibling;
  items.hidden=!items.hidden;
}));
document.querySelector(".mobile-toggle").addEventListener("click",()=>sidebar.classList.toggle("open"));
showDoc(location.hash.slice(1)||pages[0].id,false);
</script>
</body>
</html>`;

  fs.writeFileSync(path.join(wikiRoot, "index.html"), page, "utf8");
  console.log(`Built developer wiki with ${docs.length} documents.`);
}

build();
