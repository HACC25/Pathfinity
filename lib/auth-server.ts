import { headers } from "next/headers";
import { auth } from "./auth";

export const getSession = async () => {
  return auth.api.getSession({
    headers: await headers()
  });
};