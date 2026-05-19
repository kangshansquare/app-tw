import Ecs20140526, * as $Ecs20140526 from '@alicloud/ecs20140526';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import Credential from '@alicloud/credentials';

// export  function createAliyunClient(): Ecs20140526  {
//     let credential = new Credential();
//     let config = new $OpenApi.Config({
//         credential: credential
//     })
//     config.endpoint = `ecs.cn-zhangjiahou.com`
//     return new Ecs20140526(config);
// }

export const createAliyunClient = ():  Ecs20140526 => {
    const credential = new Credential(); 
    const config = new $OpenApi.Config({
        credential,
        endpoint: 'ecs.cn-zhangjiakou.aliyuncs.com', 
        
    });
    return new Ecs20140526(config);
}

