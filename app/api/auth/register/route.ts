import { NextResponse } from "next/server";
import { axiosInstance } from "@/lib/axios-instance";

type RegisterBody = {
  username: string;
  email: string;
  password: string;
};

export async function POST(request: Request) {
  try {
    const { username, email, password } = (await request.json()) as RegisterBody;

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Usuário, e-mail e senha são obrigatórios." },
        { status: 400 },
      );
    }

    const response = await axiosInstance.post("/cadastro-basico", {
      username,
      password,
      email,
    });

    return NextResponse.json(
      { message: "Cadastro realizado com sucesso.", data: response.data },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "Não foi possível concluir o cadastro." },
      { status: 400 },
    );
  }
}
