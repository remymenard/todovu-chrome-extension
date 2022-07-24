console.log("hello background");
import { ChromeRuntimeMessage } from './types/base';

type Cookie = {
  value: string;
} | null;

//(async () => {
// Contents側からの受信イベント
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    // Issue Token
    if (request.type == ChromeRuntimeMessage.ISSUE_AUTH_TOKEN) {
      chrome.cookies.get({ "url": "https://remy.todo.vu", "name": "kitovu_auth_tkt" }, function (cookie: Cookie): void {
        if (cookie !== null) {
          const myHeaders = new Headers({
            "cookies": cookie.value || ''
          });
          const myInit: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
          };

          fetch('https://remy.todo.vu/app-settings', myInit)
            .then(response => response.json())
            .then((response) => {
              console.log(response.csrf_token)
            })
          console.log(myHeaders.get("cookies"))

        }


      });
      sendAuthTokenToContent(request, sender, sendResponse)
      return true;
    }

    // Revole Token
    if (request.type == ChromeRuntimeMessage.REVOKE_AUTH_TOKEN) {
      chrome.identity.removeCachedAuthToken({ token: request.token }, () => { });
      chrome.identity.clearAllCachedAuthTokens(() => { });
      const url = `https://accounts.google.com/o/oauth2/revoke?token=${request.token}`
      fetch(url).then((response) => { });
      return true;
    }

    if (request.type == ChromeRuntimeMessage.POPUP_CLICK) {
      console.log(request)
      sendAuthTokenToContent(request, sender, sendResponse)
      return true;
    }

    sendResponse();
    return
  }
);
async function sendAuthTokenToContent(request, sender, sendResponse) {
  chrome.identity.getAuthToken(
    { interactive: request.interactive },
    (token: string | undefined) => {
      sendResponse({ token: token });
    }
  )
}
//})();
