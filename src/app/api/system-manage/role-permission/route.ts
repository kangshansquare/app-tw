import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildPermissionTreeNode } from "@/lib/permission-tree";

export async function GET(req: NextRequest) {
    // const roleId = Number(new URL(req.url).searchParams.get('roleId') || 0)
    // console.log('----------------',roleId)
    // return NextResponse.json({success: false, message: 'test'})

    try {
        const roleId = Number(new URL(req.url).searchParams.get('roleId') || 0)
        console.log('---------', roleId)
        if (!roleId) return NextResponse.json({success: false, message: 'roleId required'});

        const [ role, allPermissions, rolePerm ] = await Promise.all([
            prisma.role.findUnique({ where: {id: roleId} }),
            prisma.permission.findMany(),
            prisma.role_Permission.findMany({ where: {roleId}, select: { permissionId: true } })
        ])

        if (!role) return NextResponse.json({ success: false, message: 'role not found' })

        return NextResponse.json({
            success: true,
            data: {
                role: {
                    id: role.id,
                    name: role.name,
                    code: role.code,
                    isSystem: role.isSystem,
                    version: role.version,
                    description: role.description
                },
                permissionTree: buildPermissionTreeNode(allPermissions),
                selectPermissionsIds: rolePerm.map(rp => rp.permissionId)
            }
        })

    } catch(error) {
        return NextResponse.json({ success: false, message: '服务器错误' })
    }

}

