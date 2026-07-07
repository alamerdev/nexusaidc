function startLogin() {
  window.location.href = "https://rapid-dawn-5ec2.alamer.workers.dev/api/auth/discord/login";
}

function inviteBot() {
  window.location.href =
    "https://discord.com/oauth2/authorize?client_id=1521537524462391447&scope=bot&permissions=8";
}

async function loadLang(code) {
  const res = await fetch(`assets/lang/${code}.json`);
  const lang = await res.json();

  document.querySelector(".title").innerHTML = lang.title;
  document.querySelector(".subtitle").innerHTML = lang.subtitle;
  document.querySelector(".login-btn").innerHTML = lang.login;
}

