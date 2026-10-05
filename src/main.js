import { marked } from "marked";
import content from "../index.md?raw";
import "../assets/site.css";
import { enhanceGuide } from "../assets/site.js";

const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
if (!match) throw new Error("index.md의 맨 위에 제목과 설명이 필요합니다.");

const metadata = Object.fromEntries(
  match[1].split(/\r?\n/).map((line) => {
    const separator = line.indexOf(":");
    return separator < 0 ? [line, ""] : [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
  })
);

document.title = metadata.title || "연수 안내서";
document.querySelector('meta[name="description"]').content = metadata.description || "";
document.querySelector("#page-title").textContent = metadata.title || "연수 안내서";
document.querySelector(".hero-description").textContent = metadata.description || "";
document.querySelector("#content").innerHTML = marked.parse(content.slice(match[0].length));
enhanceGuide();
