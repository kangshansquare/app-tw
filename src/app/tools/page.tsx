// import TimeStampComponent from '@/components/TimsStamp/timestamp';
// import RandomPass from '@/components/RandomPass/RandomPass';
// import GenerSQL from '@/components/generSQL/generSQL';
// import IptablesRule from '@/components/iptablesRules/iptablesRule';
// import QueryIp from '@/components/queryIp/queryIp';

import ToolsComponent from "@/components/Tools/Tools"


export default function Tools() {

    
    
    return (
        <div className="w-full h-full flex flex-col p-5 gap-5 border-gray-200 border-2 rounded-lg overflow-auto">

            {/* <RandomPass />

            <QueryIp />

            <IptablesRule />

            <GenerSQL />
            
            <TimeStampComponent /> */}

            <ToolsComponent />

        </div>
    )
}