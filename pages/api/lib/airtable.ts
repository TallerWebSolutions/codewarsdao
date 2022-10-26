import fetch from "node-fetch";

const AIRTABLE_ENDPOINT = "https://api.airtable.com";

type Api<T> = {
  get(): Promise<T>
  post(): Promise<unknown>
  patch(): Promise<unknown>
  put(): Promise<unknown>
}

const createTableApi = (sheetId: string | undefined, table: string): Api<any> => {
  const fetcher = (options: any = {}) =>
    fetch(`${AIRTABLE_ENDPOINT}/v0/${sheetId}/${table}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }).then(async (r) => {
      try {
        return r.json()
      } catch (e) {
        console.error(e)
        console.error(await r.text())
      }
    })

  const createMethod =
    (method: string) =>
    (options: any = {}) =>
      fetcher({
        method,
        ...options,
        ...(method !== 'GET' &&
          options.body && { body: JSON.stringify(options.body) }),
      })

  return {
    get: createMethod('GET'),
    post: createMethod('POST'),
    patch: createMethod('PATCH'),
    put: createMethod('PUT'),
  }
}

type UsersPayload = {
  records: any[]
}

export const users: Api<UsersPayload> = createTableApi(process.env.AIRTABLE_SHEET_ID, 'users')
