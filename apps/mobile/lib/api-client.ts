import createClient, { Middleware } from "openapi-fetch";
import createReactQueryClient from "openapi-react-query";
import type { paths } from "@repo/shared/types";
import { authClient } from "./auth-client";

const client = createClient<paths>({
  baseUrl: "http://192.168.1.20:4000",

  credentials: "omit",
});

const authMiddleware: Middleware = {
  onRequest(options) {
    const cookies = authClient.getCookie()
    options.request.headers.set("Cookie", cookies);

    return options.request;
  },
}

client.use(authMiddleware);

export const $api = createReactQueryClient(client);