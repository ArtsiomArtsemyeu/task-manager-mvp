import { NextResponse } from "next/server";
import type { UserSession } from "@/src/entities/user";
import { defaultUser, errorMessages } from "@/src/shared/config";
import { isRecord, readJson } from "@/src/shared/utils/type-guard";

export async function POST(request: Request) {
  try {
    const body = await readJson(request);

    if (
      !isRecord(body) ||
      typeof body.email !== "string" ||
      typeof body.password !== "string" ||
      !body.email ||
      !body.password
    ) {
      return NextResponse.json(
        { error: errorMessages.validation.requiredFields },
        { status: 400 },
      );
    }

    if (body.password !== defaultUser.password) {
      return NextResponse.json(
        { error: errorMessages.error.invalidCredentials },
        { status: 401 },
      );
    }

    const userSessionPayload: UserSession = {
      userId: defaultUser.id,
      email: defaultUser.email,
    };

    return NextResponse.json({ userSessionPayload }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: errorMessages.error.server },
      { status: 500 },
    );
  }
}
