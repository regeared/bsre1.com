const params = new URLSearchParams(window.location.search);
const service = params.get("service");

let url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

switch (service) {
  case "github": {
    url = "https://github.com/HackySoft";
    break;
  }
  case "discord": {
    url = "https://dsc.gg/bsre1";
    break;
  }
  case "telegram": {
    url = "https://t.me/bsre1";
    break;
  }
}
window.location.replace(url);