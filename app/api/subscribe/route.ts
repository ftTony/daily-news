import { Resend } from "resend";
import { NextResponse } from "next/server"
export async function POST(request: Request) {
    const { email } = await request.json();
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error: createError } = await resend.contacts.create({
        email,
    })
    if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    const { error: addError } = await resend.contacts.segments.add({
        email,
        segmentId: "14ebb5b0-bad1-46ba-b181-176dd91ad5e6"
    })
    if (addError) {
        return NextResponse.json({ error: addError.message }, { status: 500 });
    }


    return new NextResponse('OK', { status: 200 })
}