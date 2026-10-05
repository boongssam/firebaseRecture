export function enhanceGuide() {
  const sectionIds = ["overview", "preparation", "build", "github", "deploy", "finish"];

  const headings = [...document.querySelectorAll(".guide-content h2")];
  const nav = document.querySelector("#section-nav");
  const navLinks = [];

  headings.forEach((heading, index) => {
    const id = sectionIds[index] ?? `section-${index + 1}`;
    heading.id = id;
    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = heading.textContent.trim();
    if (index >= 2 && index <= 4) link.classList.add("nav-phase");
    nav.append(link);
    navLinks.push(link);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = headings.indexOf(entry.target);
          navLinks.forEach((link, linkIndex) => {
            if (linkIndex === index) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        }
      },
      { rootMargin: "-12% 0px -76% 0px" }
    );
    headings.forEach((heading) => observer.observe(heading));
  }

  document.querySelectorAll(".guide-content pre").forEach((block) => {
    const code = block.querySelector("code");
    if (!code) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "복사";
    button.setAttribute("aria-label", "명령어나 예시 내용 복사");
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = "복사됨 ✓";
      } catch {
        button.textContent = "복사 불가";
      }
      window.setTimeout(() => { button.textContent = "복사"; }, 1800);
    });
    block.append(button);
  });

  const checklist = [...document.querySelectorAll('.guide-content input[type="checkbox"]')];
  checklist.forEach((box, index) => {
    const label = box.closest("li")?.textContent.trim() ?? String(index);
    const key = `recture-check:${index}:${label}`;
    box.disabled = false;
    box.checked = localStorage.getItem(key) === "true";
    box.setAttribute("aria-label", label);
    box.addEventListener("change", () => localStorage.setItem(key, String(box.checked)));
  });

  if (checklist.length) {
    const note = document.createElement("p");
    note.className = "checklist-note";
    note.textContent = "체크 상태는 이 브라우저에만 저장됩니다.";
    checklist[0].closest("ul")?.after(note);
  }
}
