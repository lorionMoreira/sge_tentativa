type SessionPayload = {
  username: string;
  basicAuthToken: string;
};

export const encodeSession = (payload: SessionPayload): string => {
  return Buffer.from(JSON.stringify(payload), "utf-8").toString("base64");
};

export const decodeSession = (session: string): SessionPayload | null => {
  try {
    const parsed = JSON.parse(
      Buffer.from(session, "base64").toString("utf-8"),
    ) as SessionPayload;

    if (!parsed?.username || !parsed?.basicAuthToken) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};
