import TimeStampComponent from '@/components/TimsStamp/timestamp';
import RandomPass from '@/components/RandomPass/RandomPass';
import Tips from '@/components/tips/tips';
import GenerSQL from '@/components/generSQL/generSQL';
import IptablesRule from '@/components/iptablesRules/iptablesRule';
import QueryIp from '@/components/queryIp/queryIp';



export default function Tools() {

    
    
    return (
        <div className="w-full h-full flex flex-col p-5 gap-5 border-gray-50 border-2 rounded-lg overflow-auto">
            
            <Tips />

            <RandomPass />

            <QueryIp />

            <IptablesRule />

            <GenerSQL />
            
            <TimeStampComponent />
        </div>
    )
}