import { string, z, ZodError } from 'zod';

const contactRegx = {
    mobile: /^1[3-9]\d{9}$/,
    landline: /^\d{3,4}-\d{7,8}(-\d+)?$/,
    ip: /^(\d{1,3}\.){3}\d{1,3}$/,
}

export const IdcSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, '机房名称不能为空'),
    location: z.union([z.string(),z.literal('')]),
    address: z.union([z.string(), z.literal('')]),
    contact: z.union([
        z.string().regex(contactRegx.mobile, '请输入合法的手机号'), 
        z.string().regex(contactRegx.landline, '请输入合法的座机号'), 
        z.literal('')
    ])
})

export const CabinetSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, '机柜编号不能为空'),
    idcId: z.number().min(1, '机柜所属机房不能为空'),
    uCount: z.number().optional(),
    powerKw: z.string().optional(),
    status: z.string().optional(),
    remake: z.string().optional()
})

export const ServiceLineSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, '业务线名称不能为空'),
    owner: z.string().optional(),
    email: z.union([
        z.string().email(),
        z.literal('')
    ]).optional(),
    status: z.string().min(1, "业务线状态不能为空")
})

export const ServerSchema = z.object({
    id: z.number().optional(),
    type: z.string().min(1, '服务器类型不能为空'),
    hostname: z.string().min(1, '主机名不能为空'),
    os: z.string().min(1, '系统类型不能为空'),
    kernelVersion: z.string().min(1, '内核信息不能为空'),
    cpuModel: z.string().min(1, 'CPU Model不能为空'),
    cpuCores: z.string().min(1, 'CPU核心数不能为空'),
    memoryGB: z.string().min(1, '内存信息不能为空'),
    diskTotal: z.string().min(1, '磁盘信息不能为空'),
    privateIp: z.string().min(1, 'IP不能为空'),
    publicIp: z.string().optional(),
    macAddress: z.string().min(1, 'Mac地址不能为空'),
    serialNumber: z.string().min(1, '序列号不能为空'),
    vendor: z.string().optional(),
    idcId: z.number().min(1, '机房信息不能为空'),
    cabinetId: z.number().min(1, '机柜信息不能为空'),
    kvms: z.number().nullable().optional()
})

export function extractCustomErrorMessage(error: ZodError) {
    return error.issues.map(issue => issue.message)
}

export const SSHConnectionInfoSchema = z.object({
    ip: z.string().regex(contactRegx.ip, '请输入合法IP地址'),
    authType: z.enum(['password', 'secret_key']),
    username: z.string().min(1, '登录账号不能为空'),
    passwordOrKey: z.string().min(1, '请输入账号密码或密钥'),
    sshPort: z.number().min(1, 'SSH端口不能为空'),
    timeout: z.number().nullable().optional(),
    idcId: z.number().min(1, '机房信息不能为空'),
    cabinetId: z.number().min(1, '机柜信息不能为空'),
})

export const CloudProviderSchema = z.object({
    name: z.string().min(1, '云平台名称不能为空'),
    provider: z.string().min(1, '云平台类型不能为空'),
})

// export const CredentialSchema = z.object({
//     name: z.string().min(1, '凭证名称不能为空'),
//     provider_id: z.number().min(1, '云平台类型不能为空'),
//     access_key_id: z.string().min(1, 'access_key_id不能为空'),
//     secret_access_key: z.string().min(1, 'secret_access_key不能为空'),
//     is_valid: z.boolean().default(true)
// })

export const CloudAccountSchema = z.object({
    providerId: z.number().min(1, '云平台ID不能为空'),
    name: z.string().min(1, '云账号名称不能为空'),
    environment: z.string().min(1, '所属环境不能为空'),
    access_key_id: z.string().min(1, 'access_key_id不能为空'),
    secret_access_key: z.string().min(1, 'secret_access_key不能为空')
})


export const UserSchema = z.object({
    name: z.string().min(1, '用户名不能为空'),
    email: z.string().email('邮箱格式不正确'),
    password: z.string().min(6, '密码至少6位')
})
export const UserEditSchema = z.object({
    name: z.string().min(1, '用户名不能为空'),
    email: z.string().email('邮箱格式不正确'),
})

export const RoleSchema = z.object({
    code: z.string().min(1, "角色码不能为空"),
    name: z.string().min(1, '角色名称不能为空'),
    isSystem: z.boolean().default(false),
    description: z.string().nullable().optional()
})
export const PermissionSchema = z.object({
    name: z.string().min(1, '权限名称不能为空'),
    code: z.string().min(1, "权限码不能为空"),
    module: z.string().min(1, "模块名不能为空"),
    action: z.string().min(1, "动作名不能为空"),
    description: z.string().nullable().optional()
})
export const RolePermissionSchema = z.object({
    roleId: z.number().min(1, '角色ID不能为空'),
    permissionId: z.number().min(1, '权限ID不能为空')
})
export const UserRoleSchema = z.object({
    userId: z.number().min(1, "用户ID不能为空"),
    roleId: z.number().min(1, "角色ID不能为空")
})