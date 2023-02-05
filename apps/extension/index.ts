const BASE_URL = "http://localhost:3000";

const startSync = async () => {};

const getCookies = (callback: (cookies: chrome.cookies.Cookie[]) => void) => {
  var cookieDomain =
    BASE_URL.indexOf("localhost") !== -1
      ? "localhost"
      : "https://prodredkindle.com";

  chrome.cookies.getAll(
    {
      url: BASE_URL,
      domain: cookieDomain,
    },
    (cookies) => {
      console.log(cookies);
      window.rekindledCookies = {};
      for (const cookie of cookies) {
        window.rekindledCookies[cookie.name] = cookie.value;
      }
      callback(cookies);
    }
  );
};
