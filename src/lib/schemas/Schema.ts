import { z } from 'zod';

const contactRegx = {
    mobile: /^1[3-9]\d{9}$/,
    landline: /^\d{3,4}-\d{7,8}(-\d+)?$/,
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