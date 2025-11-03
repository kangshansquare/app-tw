import { z } from 'zod';

const contactRegx = {
    mobile: /^1[3-9]\d{9}$/,
    landline: /^\d{3,4}-\d{7,8}(-\d+)?$/,
}

export const IdcSchema = z.object({
    name: z.string().min(1, '机房名称不能为空'),
    location: z.union([z.string(),z.literal('')]),
    address: z.union([z.string(), z.literal('')]),
    contact: z.union([
        z.string().regex(contactRegx.mobile, '请输入合法的手机号'), 
        z.string().regex(contactRegx.landline, '请输入合法的座机号'), 
        z.literal('')
    ])
})