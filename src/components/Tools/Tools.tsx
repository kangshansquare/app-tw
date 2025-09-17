'use client';

import { ClockCircleOutlined, KeyOutlined, ConsoleSqlOutlined, SafetyOutlined } from '@ant-design/icons';
import { useState } from 'react';
import TimeStampComponent from '../TimsStamp/timestamp';
import RandomPass from '../RandomPass/RandomPass';
import GenerSQL from '../generSQL/generSQL';
import IptablesRule from '../iptablesRules/iptablesRule';

export default function ToolsComponent() {

    const [ buttonFlag, setButtonFlag ] = useState<string>('time');

    const handleButtonChange = (flag: string) => {
        console.log("Flag: ", flag)
        setButtonFlag(flag)
    }

    return (
        <div className="bg-white flex flex-col px-5 gap-2">
            <div className="flex gap-8 border-b border-gray-200">
                    <button 
                        className={`font-medium ${buttonFlag === 'time' ? 'border-b-2 border-blue-600 text-blue-600' : 'border-b-2 border-white text-gray-600'} py-3 px-4 flex gap-2`}
                        onClick={() => handleButtonChange('time')}
                    >
                        <ClockCircleOutlined />
                        时间戳转换
                    </button>

                    <button 
                        className={`font-medium ${buttonFlag === 'passwd' ? 'border-b-2 border-blue-600 text-blue-600' : 'border-b-2 border-white text-gray-600'} py-3 px-4 flex gap-2`}
                        onClick={() => handleButtonChange('passwd')}
                    >
                        <KeyOutlined />
                        随机密码生成
                    </button>
                    
                    <button 
                        onClick={() => handleButtonChange('sql')}
                        className={`font-medium ${buttonFlag === 'sql' ? 'border-b-2 border-blue-600 text-blue-600' : 'border-b-2 border-white text-gray-600'} py-3 px-4 flex gap-2`}
                    >
                        <ConsoleSqlOutlined />
                        SQL语句生成
                    </button>

                    
                    <button 
                        onClick={() => handleButtonChange('iptables')}
                        className={`font-medium ${buttonFlag === 'iptables' ? 'border-b-2 border-blue-600 text-blue-600' : 'border-b-2 border-white text-gray-600'} py-3 px-4 flex gap-2`}
                    >
                        <SafetyOutlined />
                        iptables规则生成
                    </button>

            </div>
            
            <div className='pt-5'>
                { buttonFlag === 'time' && <TimeStampComponent /> }
                { buttonFlag === 'passwd' && <RandomPass /> }
                { buttonFlag === 'sql' && <GenerSQL /> }
                { buttonFlag === 'iptables' && <IptablesRule /> }
            </div>
        </div>
    )
}