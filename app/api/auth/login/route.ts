import { NextResponse } from "next/server";
import { axiosInstance } from "@/lib/axios-instance";
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants";
import { encodeSession } from "@/lib/session";

type LoginBody = {
  username: string;
  password: string;
};

export async function POST(request: Request) {
  try {
    const { username, password } = (await request.json()) as LoginBody;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Usuário e senha são obrigatórios." },
        { status: 400 },
      );
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

    const nextResponse = NextResponse.json(
      { message: "Login realizado com sucesso.", data: response.data },
      { status: 200 },
    );

    nextResponse.cookies.set(AUTH_COOKIE_NAME, encodeSession({ username, basicAuthToken }), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return nextResponse;
  } catch {
    return NextResponse.json(
      { message: "Não foi possível autenticar com as credenciais informadas." },
      { status: 401 },
    );
  }
}
