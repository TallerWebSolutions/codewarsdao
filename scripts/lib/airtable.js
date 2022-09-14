import fetch from "node-fetch";

const AIRTABLE_ENDPOINT = "https://api.airtable.com";

const createTableApi = ({ sheetId, table }) => {
  const fetcher = (options = {}) =>
    fetch(`${AIRTABLE_ENDPOINT}/v0/${sheetId}/${table}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    }).then(async (r) => {
      try {
        return r.json();
      } catch (e) {
        console.error(e);
        console.error(await r.text());
      }
    });

  const createMethod =
    (method) =>
    (options = {}) =>
      fetcher({
        method,
        ...options,
        ...(method !== "GET" &&
          options.body && { body: JSON.stringify(options.body) }),
      });

  return {
    get: createMethod("GET"),
    post: createMethod("POST"),
    patch: createMethod("PATCH"),
    put: createMethod("PUT"),
  };
};


export const users = createTableApi({
  sheetId: process.env.AIRTABLE_SHEET_ID,
  table: "users",
});
