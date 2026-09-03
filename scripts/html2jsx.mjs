/* HTML→JSX + section split for Astro→Next conversion. Not shipped.
 *   node scripts/html2jsx.mjs <src.astro> <appDir>
 * Emits <appDir>/components/S<NN>_<name>.tsx (one per top-level element,
 * which are always at column 0 in these source files) + <appDir>/_sections.txt */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const [srcPath, appDir] = process.argv.slice(2);
if (!srcPath || !appDir) {
  console.error("usage: html2jsx.mjs <src.astro> <appDir>");
  process.exit(1);
}

let body = readFileSync(srcPath, "utf8").replace(/^---[\s\S]*?---\s*/, "");
const bm = body.match(/<body[^>]*>([\s\S]*)<\/body>/i);
if (bm) body = bm[1];

const ATTR = {
  class: "className", for: "htmlFor",
  "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin",
  "stroke-dasharray": "strokeDasharray", "stroke-dashoffset": "strokeDashoffset",
  "stroke-miterlimit": "strokeMiterlimit", "stroke-opacity": "strokeOpacity",
  "fill-rule": "fillRule", "fill-opacity": "fillOpacity", "clip-rule": "clipRule", "clip-path": "clipPath",
  "stop-color": "stopColor", "stop-opacity": "stopOpacity", "text-anchor": "textAnchor",
  "dominant-baseline": "dominantBaseline", "xlink:href": "xlinkHref", crossorigin: "crossOrigin",
  allowfullscreen: "allowFullScreen", tabindex: "tabIndex", autocomplete: "autoComplete",
  maxlength: "maxLength", minlength: "minLength", readonly: "readOnly", enctype: "encType",
  srcset: "srcSet", "is:inline": "", "http-equiv": "httpEquiv",
};
const VOID = new Set(["img", "input", "br", "hr", "meta", "link", "source", "area", "col", "embed", "track", "wbr"]);

body = body.replace(/<!--([\s\S]*?)-->/g, (_, c) => `{/*${c.replace(/\*\//g, "* /")}*/}`);

const styleObj = (s) =>
  "{{ " +
  s.split(";").map((p) => p.trim()).filter(Boolean).map((p) => {
    const i = p.indexOf(":");
    let k = p.slice(0, i).trim();
    const v = p.slice(i + 1).trim();
    if (!k.startsWith("--")) k = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const key = k.startsWith("--") || /[^a-zA-Z]/.test(k) ? JSON.stringify(k) : k;
    return `${key}: ${JSON.stringify(v)}`;
  }).join(", ") +
  " }}";

body = body.replace(/<([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^<>]*?)?)(\/?)>/g, (full, tag, attrs, sc) => {
  let a = attrs || "";
  a = a.replace(/\sstyle\s*=\s*"([^"]*)"/g, (_, s) => ` style=${styleObj(s)}`);
  a = a.replace(/\sstyle\s*=\s*'([^']*)'/g, (_, s) => ` style=${styleObj(s)}`);
  a = a.replace(/(\s)([a-zA-Z:_-]+)(\s*=\s*"[^"]*"|\s*=\s*'[^']*'|)/g, (mm, sp, name, val) => {
    const low = name.toLowerCase();
    if (low in ATTR) {
      if (ATTR[low] === "") return "";
      name = ATTR[low];
    }
    return `${sp}${name}${val}`;
  });
  return `<${tag}${a}${VOID.has(tag.toLowerCase()) || sc ? " />" : ">"}`;
});

const parts = body.split(/\n(?=<(?:nav|header|section|footer|div|main|article|aside)\b)/);
mkdirSync(resolve(appDir, "components"), { recursive: true });
const list = [];
let n = 0;
for (let c of parts) {
  c = c.trim();
  if (!c) continue;
  if (/^\{\/\*/.test(c) && c.length < 120 && !/\n/.test(c)) continue;
  n++;
  const idm = /^<\S+[^>]*\sid="([^"]+)"/.exec(c);
  const clm = /^<\S+[^>]*\sclassName="([^" ]+)/.exec(c);
  const tagm = /^<([a-zA-Z][\w]*)/.exec(c);
  const raw = (idm && idm[1]) || (clm && clm[1]) || (tagm && tagm[1]) || "sec";
  const name = "S" + String(n).padStart(2, "0") + "_" + raw.replace(/[^a-zA-Z0-9]/g, "");
  writeFileSync(
    resolve(appDir, `components/${name}.tsx`),
    `export function ${name}() {\n  return (\n    <>\n${c
      .split("\n")
      .map((l) => "      " + l)
      .join("\n")}\n    </>\n  );\n}\n`,
  );
  list.push(name);
}
writeFileSync(resolve(appDir, "_sections.txt"), list.join("\n") + "\n");
console.log(`${list.length} components →`, list.join(" "));
