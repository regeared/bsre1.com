const params = new URLSearchParams(window.location.search);
const service = params.get("service");

let url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

switch (service) {
  case "github": {
    url = "https://github.com/regeared";
    break;
  }
  case "discord": {
    url = "https://discord.gg/regeared";
    break;
  }
  case "telegram": {
    url = "https://t.me/bsre1";
    break;
  }
  case "purchase": {
    url = "https://t.me/regeared_bot";
    break;
  }
}
window.location.replace(url);
