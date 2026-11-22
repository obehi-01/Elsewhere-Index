(() => {
  const data = window.SITE_CONTENT || {};
  const $ = (selector) => document.querySelector(selector);
  const journalList = $("#journal-list");
  (data.journal || []).forEach(item => {
    const article = document.createElement("article");
    article.className = "journal-card";
    const date = document.createElement("span"); date.className = "date"; date.textContent = item.date;
    const body = document.createElement("div");
    const title = document.createElement("h3"); title.textContent = item.title;
    const excerpt = document.createElement("p"); excerpt.textContent = item.excerpt;
    body.append(title, excerpt);
    const link = document.createElement("a"); link.className = "arrow"; link.href = item.url || "#"; link.textContent = "↗"; link.setAttribute("aria-label", "Open " + item.title);
    article.append(date, body, link); journalList.append(article);
  });
  const libraryGrid = $("#library-grid"), filters = $("#library-filters");
  const categories = ["ALL", ...new Set((data.library || []).map(x => x.category))];
  let active = "ALL";
  function renderLibrary() {
    libraryGrid.replaceChildren();
    const items = (data.library || []).filter(x => active === "ALL" || x.category === active);
    items.forEach(item => {
      const card = document.createElement("article"); card.className = "library-card";
      const category = document.createElement("span"); category.className = "category"; category.textContent = item.category;
      const title = document.createElement("h3"); title.textContent = item.title;
      const desc = document.createElement("p"); desc.textContent = item.description;
      const foot = document.createElement("div"); foot.className = "card-foot";
      const note = document.createElement("span"); note.textContent = item.note;
      const year = document.createElement("span"); year.textContent = item.year;
      foot.append(note, year); card.append(category, title, desc, foot); libraryGrid.append(card);
    });
    $("#library-count").textContent = String(items.length).padStart(2, "0") + " ITEMS";
  }
  categories.forEach(category => {
    const button = document.createElement("button"); button.className = "filter-button" + (category === active ? " active" : "");
    button.textContent = category; button.type = "button";
    button.addEventListener("click", () => { active = category; filters.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.textContent === active)); renderLibrary(); });
    filters.append(button);
  });
  renderLibrary();
  const timeline = $("#project-timeline");
  (data.projects || []).forEach(item => {
    const row = document.createElement("article"); row.className = "timeline-item";
    const date = document.createElement("time"); date.textContent = item.date;
    const body = document.createElement("div");
    const title = document.createElement("h3"); title.textContent = item.title;
    const desc = document.createElement("p"); desc.textContent = item.description;
    const status = document.createElement("span"); status.className = "status"; status.textContent = item.status;
    body.append(title, desc, status); row.append(date, body); timeline.append(row);
  });
  let thoughtIndex = -1;
  function newThought() {
    const thoughts = data.thoughts || ["Add thoughts in content.js"];
    let next = Math.floor(Math.random() * thoughts.length);
    if (thoughts.length > 1 && next === thoughtIndex) next = (next + 1) % thoughts.length;
    thoughtIndex = next; $("#random-thought").textContent = thoughts[next];
    $("#thought-number").textContent = String(next + 1).padStart(2, "0");
  }
  $("#thought-button").addEventListener("click", newThought); newThought();
  const form = $("#guestbook-form"), entries = $("#guestbook-entries");
  const storageKey = "elsewhere-index-guestbook";
  function loadEntries() {
    let saved = []; try { saved = JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch (_) {}
    entries.replaceChildren();
    saved.slice().reverse().forEach(entry => {
      const article = document.createElement("article"); article.className = "guest-entry";
      const name = document.createElement("strong"); name.textContent = entry.name;
      const message = document.createElement("p"); message.textContent = entry.message;
      article.append(name, message); entries.append(article);
    });
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#guest-name").value.trim(), message = $("#guest-message").value.trim();
    if (!name || !message) return;
    let saved = []; try { saved = JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch (_) {}
    saved.push({ name, message, date: new Date().toISOString() });
    localStorage.setItem(storageKey, JSON.stringify(saved.slice(-30)));
    form.reset(); loadEntries();
  });
  loadEntries();
  const menu = $(".menu-toggle"), nav = $("#main-nav");
  menu.addEventListener("click", () => { const open = nav.classList.toggle("open"); menu.setAttribute("aria-expanded", String(open)); });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); }));
  $("#year").textContent = new Date().getFullYear();
  $("#today-date").textContent = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date()).toUpperCase() + " / WEST AFRICA";
})();
