import { CloudProviderInstance, CloudProviderHandler } from '@/types/cloud-provider';
import { createAliyunClient } from './client';
import Ecs20140526, * as $Ecs20140526 from '@alicloud/ecs20140526';
import Util, * as $Util from '@alicloud/tea-util';

interface AliyunCredentials {
    accessKeyId: string;
    accessKeySecret: string;
    regionId?: string;
}

export const aliyunHandler: CloudProviderHandler = {
    async listInstances(credentials: AliyunCredentials)  {



        return []
    },
    async listRegions(credentials: AliyunCredentials) {
        const client = createAliyunClient();
        let describeRegionsRequest = new $Ecs20140526.DescribeRegionsRequest({ });
        let runtime = new $Util.RuntimeOptions({ });
        try {
            const res = await client.describeAccountAttributesWithOptions(describeRegionsRequest, runtime)
        } catch(error) {

        }
        return []
    }
}