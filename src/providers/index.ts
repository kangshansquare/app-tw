import type { CloudProviderHandler } from "@/types/cloud-provider";

export const PROVIDER_HANDLERS = {
    aliyun: async(): Promise<CloudProviderHandler> => {
        const { aliyunHandler } = await import('./aliyun/handler')
        return aliyunHandler
    }

} as const;

export async function getProviderHandler(providerCode: string) {
    const factory = PROVIDER_HANDLERS[providerCode as keyof typeof PROVIDER_HANDLERS];
    if (!factory) {
        throw new Error(`Unsupported cloud provider: ${providerCode}`)
    }
    return factory();
}