import type { NextApiRequest, NextApiResponse } from "next";
import { axiosInstance } from "@/lib/axios-instance";

type Data = { message: string; data?: unknown };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  try {
    const { username, email, password } = req.body as {
      username?: string;
      email?: string;
      password?: string;
    };

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Usuário, e-mail e senha são obrigatórios." });
    }

    const response = await axiosInstance.post("/cadastro-basico", {
      username,
      password,
      email,
    });

    return res.status(201).json({
      message: "Cadastro realizado com sucesso.",
      data: response.data,
    });
  } catch {
    return res.status(400).json({
      message: "Não foi possível concluir o cadastro.",
    });
  }
}
