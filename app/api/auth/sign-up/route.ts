import { NextResponse } from "next/server";
import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";

export async function POST(req: Request) {
  try {
    const { email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry } = (await req.json()) as SignUpFormData;

    const response = await auth.api.signUpEmail({
      body: { email, password, name: fullName },
    });

    if (response) {
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          password,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
    }

    return NextResponse.json({ success: true, data: response });
  } catch (e) {
    console.error("Sign up failed!", e);
    return NextResponse.json({ success: false, message: "Sign up failed!" }, { status: 400 });
  }
}
