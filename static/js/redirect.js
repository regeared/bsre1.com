const params = new URLSearchParams(window.location.search);
const service = params.get("service");

let url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

switch (service) {
  case "github": {
    url = "https://github.com/REGeared";
    break;
  }
  case "discord": {
    url = "https://discord.gg/REGeared";
    break;
  }
  case "telegram": {
    url = "https://t.me/bsre1";
    break;
  }
  case "purchase": {
    url = "https://t.me/REGeared_bot";
    break;
  }
}
window.location.replace(url);
