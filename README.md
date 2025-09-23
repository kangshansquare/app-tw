1.npx create-next-app@14.2.5
```
npx create-next-app@14.2.5
√ What is your project named? ... app-tw
√ Would you like to use TypeScript? ... No / Yes
√ Would you like to use ESLint? ... No / Yes
√ Would you like to use Tailwind CSS? ... No / Yes
√ Would you like to use `src/` directory? ... No / Yes
√ Would you like to use App Router? (recommended) ... No / Yes
√ Would you like to customize the default import alias (@/*)? ... No / Yes
Creating a new Next.js app in D:\cursor\app-tw.
```
ui:
```
npm i @mui/material @emotion/react @emotion/styled lucide-react numeral date-fns axios recharts react-dnd react-dnd-html5-backend gantt-task-react

npm i @mui/x-data-grid

npm i -D @types/node @types/uuid @types/numeral
```

## Prisma with Nextjs
1.启动mysql
```
docker run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_RANDOM_ROOT_PASSWORD=123456 mysql:5.7
```
2.安装prisma
```
npm i prisma
```
3.prisma  cli
创建prisma ORM项目：
```
npx prisma init 
```
- 会在当前目录生成prisma目录，该目录包含名为schema.prisma 的文件，该文件包含带有数据库连接变量和模式模型的 Prisma 模式。
- 创建一个`.env`文件，用于定义环境变量（例如数据库连接）

4.连接Mysql
Prisma连接Mysql配置：https://www.prisma.io/docs/orm/overview/databases/mysql#connection-url

schema.prisma：
```
generator client {                       # 用于生成mysql client
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"                    # mysql
  url      = env("DATABASE_URL")
}
```
`.env`：
```
#   DATABASE_URL="connector://user@password@host:port/database?argument"          
DATABASE_URL="mysql://root:123456@localhost:3306/nextapp"
```
注意：如果已加入版本控制（git），在`gitignore`文件中添加`.env`文件。

5.定义数据模型
schema.prisma：
```
# 定义一个User表
model User {
  id        Int     @id @default(autoincrement())     # id字段，int类型，默认值（自增）
  email     String  @unique                           # email字段，string类型，唯一
  name      String                                    # name字段，string类型
  followers Int     @default(0)                       # followers字段，int类型，默认值（0）
  isActive  Boolean @default(true)                    # isActive字段，Boolean类型，默认值（true）
}
```
在命令行执行`npx prisma format`可以格式化显示定义的数据模型

迁移数据（使定义的模型生效）
```
npx prisma migrate dev
```

## Todo
- [x] 日期组件
- [x] 导航菜单
- [x] 弹窗
- [ ] 登录、认证
- [ ] 权限控制（菜单栏权限）
- [ ] 页面跳转（nextjs v13）
```
1. useRoute
import { useRoute } from 'next/navigation'
const route = useRoute();
route.push('/')                    # 不会强制刷新页面

window.location.href = '/'         # 会强制刷新页面。登录/登出，用户登录状态属性有变化，使用window.location.href

2.redirect
import { redirect } from 'next/navigation'



3.NextResponse
import { NextResponse } from "next/server";
return NextResponse.redirect(new URL('/'), request.url)

4.next.config.js 或 Middleware

5.url
访问/tools ---> 未登录 ---> 跳转到/login ---> 登录成功 ---> redirect /tools     # cookie + session 有状态认证。需要记录用户行为
访问/tools ---> 未登录 ---> 跳转到/login ---> 登录成功 ---> redirect /          # cookie 无状态认证。不记录用户行为，判断登录有无token（cookie存在浏览器中）

```
- [ ] api 
```
app router:   Server Component 或 Route Handler
    app/                   
      api/                 /api
        route.ts

    app/                   
      api/                 /api/auth
        auth/
          route.ts


page route:  Api Router
    pages/
      api/                 /api/hello              
        hello.ts      

Server Component:
    服务端使用fetch：
        使用fetch获取到的数据，默认将数据缓存到Data Cache放在Server端

    服务端使用第三方库:

    客户端使用Route Handler:

    客户端使用第三方库:

Server Action ?
```

- [ ] tailwind css 全局变量、响应式布局
- [ ] middleware
- [x] 添加导航：云平台
```
阿里云: /aliyun
腾讯云：/tencent-clound
```
- [x] 用户登陆后显示自己的任务
```
1.任务表与用户表，通过“外键关联”实现用户与任务绑定

- Tips表（任务表）添加user_id字段（外键），关联用户表的“id”字段

# @/prisma/schema.prisma
model User {
  id           Int     @id @default(autoincrement())
  email        String  @unique
  name         String  @unique
  passwordHash String
  isActive     Boolean @default(true)
  isAdmin      Boolean @default(false)
  tips         Tips[]
}

model Tips {
  id         Int      @id @default(autoincrement())
  title      String
  content    String
  ExpireDate DateTime
  status     String
  priority   String   @default(medium)
  user_id    Int
  user       User     @relation(fields: [user_id], references: [id])
}

格式化model：npx prisma format
运行数据库迁移来应用更改：npx prisma migrate dev --name add_user_id_to_tips


2.用户登陆，后端验证成功后，生成Token，记录当前用户的“user_id”；

- 登陆成功后，将用户id保存到token中

/login -- 用户名和密码 -- /api/auth 验证 -- 登陆成功 -- 设置token（包含用户名和userId）

# /api/auth/route.ts
const user_id = user?.id
const token = jwt.sign({ username: user.name, userId: user_id }, SECRET_KEY, { expiresIn: '7d' });

# /api/user/get-id/route.ts
export async function GET(req: NextRequest) {
    ...
    const token = req.headers.get("cookie")?.replace("token", "")

    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" });
    
    const decoded = jwt.verify(token, SECRET_KEY) as { username: string, userId: number };
    const userId = decoded.userId;

    return NextResponse.json({ success: true, userId });
}

# app/tips/page.tsx
const getUerId = async () => {
    const res = await fetch('/api/user/get-id', {
        method: "GET",
        credentials: 'include'        // 让浏览器自动携带cookie
    })

    const data = await res.json()

    if (data?.success) return data.userId;
}

const user_id = getUserId();

# 不要从前端给后端传递user_id（app/tips/page.tsx），而是应该使用统一鉴权方式。后端api接口从cookie中获取token
# 提供从cookie中获取user_id的工具函数 @/lib/auth.ts
export function getUserIdFrromToken(): number | null {
    const cookie = cookies().get('token')?.value
    const auth = headers().get('authorization')?.replace(/^Bearer\s+/i, '');
    const token = cookie || auth;
    if (!token) return null;
    try {
        // JWT playload 结构要与登录时一致
        const playload = jwt.verify(token, SECRET_KEY!) as {
            username: string;
            userId: number;
            iat: number;
            exp: number
        }
        return playload.userId;
    } catch {
        return null
    }
}

# middleware对api接口统一鉴权
# 对api接口鉴权: 认证接口免鉴权
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
export const config = {
    matcher: [
        '/api/:path*',
        ...
    ]
}

# 后端接口从cookie中获取user_id
# api/tip/route.ts
import { getUserIdFrromToken } from '@/lib/auth';
const user_id = getUserIdFrromToken();
if (!user_id) return NextResponse.json({
    success: false,
    code: 'UNAUTHORIZED',
    message: 'Unauthorized'
}, { status: 401 })

const items = await prisma.tips.findMany({
    where: { user_id },
    orderBy: { create_time: 'desc' }
})
```
- [ ] 监控信息展示
```
通过脚本收集信息，api推送到server --- 入库 --- web展示（颗粒度 天/周/月）
```

- [ ] 数据缓存revalidate 与  revalidatePath或revalidateTag(主动刷新)
- [x] 分页
```
1.展示页：当前页、总页数；上一页、下一页；请求url携带page（当前页）、pageSize（每页显示几条数据）；默认（组件挂载时，显示第一页，即page=1）
2.api接口：根据传递参数获取数据 
const data = await prispma.database.findMany({
    skip,        // 跳过多少条数据，值是(page - 1) * pageSize
    limit,       // 限制多少条，即pageSize
    orderBy: {
        apply_date: 'desc'    // 根据apply_date字段排序
    }
})
```
- [ ] React useCallback、useMemo、Context、自定义hook
- [ ] AbortController、AbortSignal
- [ ] 后端zod校验
- [ ] prisma查询优化
```
const grouped = await prisma.tips.groupBy({
    by: ['status'],
    _count: { _all: true},
    where: { user_id: userId }
})
```
- [ ] 登录页面"记住我"
- [ ] Context
```
// 
```