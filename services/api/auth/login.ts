import type { NextApiRequest, NextApiResponse } from "next";
import { axiosInstance } from "@/lib/axios-instance";
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants";
import { encodeSession } from "@/lib/session";

type Data =
  | { message: string; data?: unknown }
  | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  try {
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Usuário e senha são obrigatórios." });
    }

    const basicAuthToken = Buffer.from(`${username}:${password}`).toString(
      "base64",
    );

    const response = await axiosInstance.post(
      "/login",
      { username, password },
      {
        headers: {
          Authorization: `Basic ${basicAuthToken}`,
        },
      },
    );

    const maxAge = 60 * 60 * 8;
    const secure = process.env.NODE_ENV === "production" ? "Secure; " : "";
    res.setHeader(
      "Set-Cookie",
      `${AUTH_COOKIE_NAME}=${encodeSession({ username, basicAuthToken })}; Path=/; HttpOnly; SameSite=Lax; ${secure}Max-Age=${maxAge}`,
    );

    return res.status(200).json({
      message: "Login realizado com sucesso.",
      data: response.data,
    });
  } catch {
    return res.status(401).json({
      message: "Não foi possível autenticar com as credenciais informadas.",
    });
  }
}
