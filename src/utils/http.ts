import { isEmpty } from "lodash";

/**
 * fetch() wrapper
 * @param uri /api
 * @param method POST
 * @param body empty obj {}
 * @param contentType application/json
 */
export const HTTP = async (
  uri: string = "/api",
  method: string = "POST",
  body: object = {},
  contentType: string = "application/json"
): Promise<Response> => {
  return await fetch(uri, {
    method,
    headers: {
      "Content-Type": contentType,
    },
    body: !isEmpty(body) ? JSON.stringify(body) : null,
  });
};
