import { challenges, leaderboard, activity, createChallenge, filterChallenges } from "./data.js";

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const state = { challenges: [...challenges], filter: "Todos", query: "" };

function challengeTemplate(challenge) {
  return `
    <article class="challenge-card" data-id="${challenge.id}">
      <div class="challenge-banner" style="--banner:${challenge.banner}">
        <span class="game-badge">${challenge.game}</span>
      </div>
      <div class="challenge-body">
        <div class="player-row">
          <span class="mini-avatar" style="--avatar:${challenge.avatar}">${challenge.initials}</span>
          <span class="player-info"><strong>${challenge.player}</strong><small>${challenge.handle} · Nivel ${challenge.level}</small></span>
          <span class="rating">★ ${challenge.rating}</span>
        </div>
        <div class="match-meta">
          <span>MODO<strong>${challenge.mode}</strong></span>
          <span>PLATAFORMA<strong>${challenge.platform}</strong></span>
          <span>RECOMPENSA<strong>${challenge.points} pts</strong></span>
        </div>
        <button class="accept-button" data-accept="${challenge.id}">Aceptar reto · ${challenge.time}</button>
      </div>
    </article>`;
}

function renderChallenges() {
  $("#featuredChallenges").innerHTML = state.challenges.slice(0, 3).map(challengeTemplate).join("");
  const visible = filterChallenges(state.challenges, state.filter, state.query);
  $("#allChallenges").innerHTML = visible.map(challengeTemplate).join("");
  $("#emptyState").hidden = visible.length > 0;
}

function renderLeaderboard() {
  $("#leaderboard").innerHTML = leaderboard.map((player, index) => `
    <article class="leader-row">
      <span class="rank">#${index + 1}</span>
      <div class="leader-profile"><span class="mini-avatar" style="--avatar:${player.avatar}">${player.initials}</span><span><strong>${player.name}</strong><small>${player.handle}</small></span></div>
      <span class="leader-stat"><small>VICTORIAS</small><strong>${player.wins}</strong></span>
      <span class="leader-stat"><small>REPUTACIÓN</small><strong>★ ${player.rating}</strong></span>
    </article>`).join("");
}

function renderActivity() {
  $("#activityList").innerHTML = activity.map(item => `
    <article class="activity-item">
      <span class="activity-result ${item.result === "Victoria" ? "win" : "loss"}">${item.result === "Victoria" ? "V" : "D"}</span>
      <span class="activity-copy"><strong>${item.game} contra ${item.opponent}</strong><small>${item.date} · ${item.mode}</small></span>
      <span class="activity-score">${item.score}</span>
    </article>`).join("");
}

function navigate(sectionId) {
  $$(".page-section").forEach(section => section.classList.toggle("active", section.id === sectionId));
  $$(".nav-item[data-section]").forEach(link => link.classList.toggle("active", link.dataset.section === sectionId));
  $(".sidebar").classList.remove("open");
  window.location.hash = sectionId;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("visible"), 2600);
}

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-section], [data-go-to]");
  if (nav) {
    event.preventDefault();
    navigate(nav.dataset.section || nav.dataset.goTo);
  }
  if (event.target.closest("[data-open-challenge]")) $("#challengeModal").showModal();
  const accept = event.target.closest("[data-accept]");
  if (accept) {
    const challenge = state.challenges.find(item => item.id === Number(accept.dataset.accept));
    showToast(`Reto de ${challenge.player} aceptado. Revisa tu actividad.`);
    accept.textContent = "Reto aceptado ✓";
    accept.disabled = true;
  }
});

$("#challengeForm").addEventListener("submit", event => {
  const submitter = event.submitter;
  if (!submitter || submitter.value === "cancel") return;
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const challenge = createChallenge(Object.fromEntries(new FormData(form)));
  state.challenges.unshift(challenge);
  renderChallenges();
  $("#challengeModal").close();
  form.reset();
  navigate("retos");
  showToast("Tu reto fue publicado correctamente.");
});

$("#gameFilters").addEventListener("click", event => {
  const filter = event.target.closest("[data-filter]");
  if (!filter) return;
  state.filter = filter.dataset.filter;
  $$(".filter").forEach(button => button.classList.toggle("active", button === filter));
  renderChallenges();
});

$("#searchInput").addEventListener("input", event => {
  state.query = event.target.value;
  if (state.query) navigate("retos");
  renderChallenges();
});

$("#menuButton").addEventListener("click", () => $(".sidebar").classList.toggle("open"));
$("#helpButton").addEventListener("click", () => $("#helpModal").showModal());
$("[data-close-help]").addEventListener("click", () => $("#helpModal").close());
$("#profileButton").addEventListener("click", () => showToast("Perfil de @leo10 · Beta privada"));

renderChallenges();
renderLeaderboard();
renderActivity();
navigate(window.location.hash.slice(1) || "inicio");
