// cookie
// import { cookies } from "next/headers";

// export async function GET(request: Request) {
//     const cookieStore = cookies();
//     const token = cookieStore.get('token');

//     return new Response('Hello, Next.JS!', {
//         status: 200,
//         headers: {
//             'Set-Cookie': `token=${token ? token.value: ''}`,
//         }
//     })
// }


// NextRequest 
// import { type NextRequest } from "next/server";
// import { headers } from "next/headers";

// export async function GET(request: NextRequest) {

//     const headersList = headers();

//     console.log('Headers:', headersList)

//     const token = request.cookies.get('token')

//     return new Response('Hello, Next.JS!', {
//         status: 200,
//         headers: {
//             'Set-Cookie': `token=${token ? token.value: ''}`,
//         }
//     })
// }


// redirect
// import { redirect } from "next/navigation";

// export async function GET() {
//     redirect('/');
// }


import jwt from 'jsonwebtoken';

import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.SECRET_KEY || '';

export async function GET(request: NextRequest) {
    const token = request.headers.get('cookie')?.replace('token=', '');
    console.log(request.headers.get('cookie')?.replace('token=', ''));

    // if (!token) {
    //     return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    //         status: 401,
    //     });
    // }

    // try {
    //     jwt.verify(token, SECRET_KEY);
    // } catch (error) {
    //     return new Response(JSON.stringify({ error: 'Forbidden' }), {
    //         status: 403,
    //     });
    // }

    return NextResponse.json({ message: 'Hello, Next.js!' }, { status: 200 });

}