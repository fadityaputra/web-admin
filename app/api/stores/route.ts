import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        console.log("UserID =>", userId);

        const body = await req.json();

        const {name} = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
          }

        if (!name) {
            return new NextResponse("nama toko perlu di input", { status: 400 });
          }

        const store = await db.store.create({
            data:{
                name,
                userId
            }
        })

        return NextResponse.json(store);
        
    } catch (error) {
        console.log("[STORE_POST]", error)
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}