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
- [ ] 添加导航：云平台
```
阿里云: /aliyun
腾讯云：/tencent-clound
```