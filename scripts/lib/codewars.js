import fetch from "node-fetch";

const TOKEN = process.env.CODEWARS_TOKEN;
const ENDPOINT = "https://www.codewars.com";

const api = (url, options = {}) => {
  return fetch(`${ENDPOINT}/api/v1${url}`, {
    ...options,
    headers: {
      Authorization: TOKEN,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  }).then(async (r) => {
    try {
      return r.json();
    } catch (e) {
      console.log(e);
      console.log(await r.text());
    }
  });
};

api.post = (url, options = {}) =>
  api(url, {
    method: "POST",
    ...options,
    ...(options.body && { body: JSON.stringify(options.body) }),
  });

api.get = (url, options = {}) => api(url, { method: "GET", ...options });

export default api;
