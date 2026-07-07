function startLogin() {
  window.location.href = "https://DEIN-WORKER.workers.dev/api/auth/discord/login";
}

function inviteBot() {
  window.location.href =
    "https://discord.com/oauth2/authorize?client_id=DEINE_CLIENT_ID&scope=bot&permissions=8";
}

async function loadLang(code) {
  const res = await fetch(`assets/lang/${code}.json`);
  const lang = await res.json();

  document.querySelector(".title").innerHTML = lang.title;
  document.querySelector(".subtitle").innerHTML = lang.subtitle;
  document.querySelector(".login-btn").innerHTML = lang.login;
}
