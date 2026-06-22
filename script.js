const githubApiUrl = 'https://api.github.com/users/CaioParadizo';
const githubReposBaseUrl = 'https://api.github.com/users/CaioParadizo/repos';

const githubName = document.getElementById('githubName');
const githubBio = document.getElementById('githubBio');
const githubAvatar = document.getElementById('githubAvatar');
const repoCount = document.getElementById('repoCount');
const followersCount = document.getElementById('followersCount');
const followingCount = document.getElementById('followingCount');
const repoGrid = document.getElementById('repoGrid');

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'short'
  }).format(date);
}

const themeToggle =
  document.getElementById("themeToggle");

const savedTheme =
  localStorage.getItem("theme") || "dark";

if (savedTheme === "light") {
  document.body.classList.add("light-mode");
  themeToggle.checked = true;
}

themeToggle.addEventListener("change", () => {

  if (themeToggle.checked) {
    document.body.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  } else {
    document.body.classList.remove("light-mode");
    localStorage.setItem("theme", "dark");
  }

});


function setLanguage(lang) {
  document.querySelectorAll("[data-pt]").forEach(element => {
    element.textContent = element.dataset[lang];
  });

  localStorage.setItem("lang", lang);
}
const toggle = document.getElementById("langToggle");

toggle.addEventListener("change", () => {
  const lang = toggle.checked ? "en" : "pt";

  setLanguage(lang);

  localStorage.setItem("lang", lang);
});

function createRepoCard(repo) {
  const card = document.createElement('article');
  card.className = 'repo-card';
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => window.open(repo.html_url, '_blank'));

const toggle = document.getElementById("langToggle");

toggle.addEventListener("click", () => {
  const current =
    localStorage.getItem("lang") || "pt";

  const next =
    current === "pt" ? "en" : "pt";

  setLanguage(next);
});

  const title = document.createElement('h3');
  title.textContent = repo.name;

  const description = document.createElement('p');
  description.textContent = repo.description || 'Descrição breve não disponível.';

  const meta = document.createElement('div');
  meta.className = 'repo-meta';

  const language = document.createElement('span');
  language.textContent = repo.language ? `Linguagem: ${repo.language}` : 'Linguagem: —';

  const updated = document.createElement('span');
  updated.textContent = `Atualizado: ${formatDate(repo.updated_at)}`;

  const stars = document.createElement('span');
  stars.textContent = `⭐ ${repo.stargazers_count}`;

  meta.append(language, updated, stars);
  card.append(title, description, meta);
  return card;
}

function showRepoError(message) {
  repoGrid.innerHTML = `<div class="repo-empty">${message}</div>`;
}

async function fetchAllGithubRepos() {
  const repos = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await fetch(`${githubReposBaseUrl}?sort=updated&direction=desc&per_page=${perPage}&page=${page}`);
    if (!response.ok) {
      throw new Error('Não foi possível carregar os repositórios do GitHub.');
    }

    const pageRepos = await response.json();
    repos.push(...pageRepos);

    if (!Array.isArray(pageRepos) || pageRepos.length < perPage) {
      break;
    }

    page += 1;
  }

  return repos;
}

async function loadGithubProfile() {
  try {
    const profileResponse = await fetch(githubApiUrl);
    if (!profileResponse.ok) {
      throw new Error('Não foi possível carregar dados do GitHub.');
    }

    const profile = await profileResponse.json();
    const repos = await fetchAllGithubRepos();

    githubName.textContent = profile.name || profile.login;
    githubBio.textContent = profile.bio || 'Desenvolvedor com presença ativa no GitHub.';
    repoCount.textContent = profile.public_repos ?? '0';
    followersCount.textContent = profile.followers ?? '0';
    followingCount.textContent = profile.following ?? '0';

    repoGrid.innerHTML = '';
    if (Array.isArray(repos) && repos.length > 0) {
      repos.forEach(repo => repoGrid.appendChild(createRepoCard(repo)));
    } else {
      showRepoError('Nenhum repositório encontrado no momento.');
    }
  } catch (error) {
    console.error(error);
    githubName.textContent = 'GitHub indisponível';
    githubBio.textContent = 'Verifique sua conexão ou tente novamente mais tarde.';
    showRepoError('Não foi possível carregar os repositórios.');
  }
}

window.addEventListener('DOMContentLoaded', loadGithubProfile);

