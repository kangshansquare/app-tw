import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = 'aes-256-gcm';   // AES-256-GCM算法

const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

// 加密函数
export function encrypt(plaintext: string): {
    encryptedData: string,
    iv: string,
    authTag: string
} {
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGORITHM, KEY, iv)

    let encrypted = cipher.update(plaintext, 'utf-8', 'base64');   // 执行加密
    encrypted += cipher.final('base64')

    const authTag = cipher.getAuthTag().toString('base64');   // 获取认证标签(用于验证密文未被篡改)

    return {
        encryptedData: encrypted,
        iv: iv.toString('base64'),
        authTag
    }
}

// 解密函数
export function decrypt(ciphertext: string, ivBase64: string, authTagBase64: string): string {
    // 将Base64的IV和authTag转回Buffer
    const iv = Buffer.from(ivBase64, 'base64');    
    const authTag = Buffer.from(authTagBase64, 'base64')

    // 创建解密器
    const decipher = createDecipheriv(ALGORITHM, KEY, iv);
    // 设置认证标签
    decipher.setAuthTag(authTag)

    // 执行解密
    let decrypted = decipher.update(ciphertext, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted    // 返回明文
}
