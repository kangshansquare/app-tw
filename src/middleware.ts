import { NextResponse, NextRequest } from 'next/server';


export function middleware(request: NextRequest, response: NextResponse) {
    const token = request.headers.get('cookie')?.replace('token=', '');
    const { pathname } = request.nextUrl;

    console.log("Token: ", token)

    console.log(pathname)

    if (pathname === '/login' || pathname === '/register') {
        // 如果是登录或注册页面，不需要验证token
        return NextResponse.next();
    }

    // 对api接口鉴权: 认证接口免鉴权
    const publicApiPaths = ['/api/auth', '/api/register', '/api/check-auth'];
    if (pathname.startsWith('/api') && publicApiPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }
    // 其他api接口需要鉴权
    if (pathname.startsWith('/api')) {
        if (!token) {
            return NextResponse.json({
                success: false,
                code: 'UNAUTHORIZED',
                message: 'Unauthorized'
            }, { status: 401 })
        }
    }


    // 如果没有token，重定向到登录页面
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 如果有token，继续请求
    return NextResponse.next();
    
}

export const config = {
    matcher: [
                '/', 
                '/dashboard/:path*', 
                '/tools/:path*', 
                '/record/:path*', 
                '/profile/:path*', 
                '/aliyun/:path*', 
                '/tencent-cloud/:path*', 
                '/tips/:pth*',
                '/api/:path*'
            ],
}