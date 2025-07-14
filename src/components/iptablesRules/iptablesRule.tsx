'use client';


import { useState,useRef, useEffect } from "react";

type RuleType = 'rule_11' | 'rule_17' | 'rule_19';
interface Inputs {
    vpnIp: string;
    target_ip_port: string
}

interface Textareas {
    rule_11: string[];
    rule_17: string[];
    rule_19: string[];
}



export default function IptablesRule() {

    const [inputs, setInputs] = useState<{ [key: string]: string }>({});
    
    const timers = useRef<{ [key: string]: NodeJS.Timeout | null }>({})

    const [textareas, setTextareas] = useState<{ [key: string]: Array<string> }>({});

    const handleInputChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        if (timers.current[key]) {
            clearTimeout(timers.current[key])
        }
        timers.current[key] = setTimeout(() => {
            setInputs(prev => ({ ...prev, [key]: value }))
        },300)
    }

    // 组件卸载时清理所有定时器，防止内存泄露
    useEffect(() => {
        return () => {
            Object.values(timers.current).forEach(timer => timer && clearTimeout(timer))
        }
    })
    
    const handleButtonClick = () => {

        const vpnIp = inputs['vpnIp'];
        const target_ip_port = inputs['target_ip_port']

        const rules_11: string[] = [];
        const rules_17: string[] = [];
        const rules_19: string[] = [];

        // const ips = vpnIp.includes(',') ? vpnIp.split(',').map(ip => ip.trim()).filter(Boolean) : vpnIp
        // const ip_ports = target_ip_port.includes('\n') ? target_ip_port.split('\n').map(t => t.trim()).filter(Boolean) : target_ip_port

        const ips = vpnIp ? vpnIp.split(',').map(ip => ip.trim()).filter(Boolean) : [];
        const ip_ports = target_ip_port ? target_ip_port.split('\n').map(t => t.trim()).filter(Boolean) : [];
        
        // const ipRegex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
        // 示例用法
        // console.log(ipRegex.test("192.168.1.1")); // true
        // console.log(ipRegex.test("256.1.1.1"));   // false
        const ipRegex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
        const ipRegex_common = /^172.19(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){2}$/
        const ipRegex_yunying = /^172.89(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){2}$/

        if (ips) {
            for (let ip of ips) {
                if (!ipRegex_common.test(ip) && !ipRegex_yunying.test(ip)) {
                    alert("vpn ip无效!");
                    return;
                }
            }
        }

        if (ip_ports) {
            for (let ip_port of ip_ports) {
                const [ip, ports] = ip_port.split(" ")
                if (!ipRegex.test(ip)) { alert("目标IP无效!"); return; }
                if (!ports) { alert("目标端口不能为空!"); return; }
            }
        }


        for (let ip of ips) {
            for (let ip_port of ip_ports) {
                const [t_ip, ports] = ip_port.split(" ")
                const port = ports.includes(',') ? ports.split(',').map(p => p.trim()).filter(Boolean) : [ports]
                console.log('Port:',port.includes(":"))
                if (ipRegex_yunying.test(ip)) {
                    // const r = port.length > 1  ? 
                    // `iptables -t nat -A POSTROUTING -o br0 -s ${ip}/32 -d ${t_ip}/32 -p tcp -m multiport --dports ${port.join(',')} -j SNAT --to-source 172.18.30.19` :
                    // `iptables -t nat -A POSTROUTING -o br0 -s ${ip}/32 -d ${t_ip}/32 -p tcp --dports ${port.join('')} -j SNAT --to-source 172.18.30.19`

                    // // setTextareas(prev => ({...prev, ['rule_19']: prev['rule_19'] ? [...prev['rule_19'], rule] : [rule]}))
                    // rules_19.push(r)

                    const r = port.length === 1 && /^\d+$/.test(port[0]) ? 
                    `iptables -t nat -A POSTROUTING -o br0 -s ${ip}/32 -d ${t_ip}/32 -p tcp --dport ${port.join('')} -j SNAT --to-source 172.18.30.19` :
                    `iptables -t nat -A POSTROUTING -o br0 -s ${ip}/32 -d ${t_ip}/32 -p tcp -m multiport --dports ${port.join(',')} -j SNAT --to-source 172.18.30.19`

                    rules_19.push(r)
                    
                } else if (ipRegex_common.test(ip)) {
                    // const r_11 = port.length > 1 ?
                    // `iptables -t nat -A POSTROUTING -o br0 -s ${ip}/32 -d ${t_ip}/32 -p tcp -m multiport --dports ${port.join(',')} -j SNAT --to-source 172.18.30.11` : 
                    // `iptables -t nat -A POSTROUTING -o br0 -s ${ip}/32 -d ${t_ip}/32 -p tcp --dport ${port.join('')} -j SNAT --to-source 172.18.30.11`

                    // const r_17 = port.length > 1 ?
                    // `iptables -t nat -A POSTROUTING -o br0 -s ${ip}/32 -d ${t_ip}/32 -p tcp -m multiport --dports ${port.join(',')} -j SNAT --to-source 172.18.32.17` : 
                    // `iptables -t nat -A POSTROUTING -o br0 -s ${ip}/32 -d ${t_ip}/32 -p tcp --dport ${port.join('')} -j SNAT --to-source 172.18.32.17`

                    // rules_11.push(r_11)
                    // rules_17.push(r_17)
                    const r_11 = port.length === 1 && /^\d+$/.test(port[0]) ? 
                    `iptables -t nat -A POSTROUTING -o br0 -s ${ip}/32 -d ${t_ip}/32 -p tcp --dport ${port.join('')} -j SNAT --to-source 172.18.30.11` :
                    `iptables -t nat -A POSTROUTING -o br0 -s ${ip}/32 -d ${t_ip}/32 -p tcp -m multiport --dports ${port.join(',')} -j SNAT --to-source 172.18.30.11`

                    const r_17 = port.length === 1 && /^\d+$/.test(port[0]) ? 
                    `iptables -t nat -A POSTROUTING -o br0 -s ${ip}/32 -d ${t_ip}/32 -p tcp --dport ${port.join('')} -j SNAT --to-source 172.18.32.17` :
                    `iptables -t nat -A POSTROUTING -o br0 -s ${ip}/32 -d ${t_ip}/32 -p tcp -m multiport --dports ${port.join(',')} -j SNAT --to-source 172.18.32.17`

                    rules_11.push(r_11)
                    rules_17.push(r_17)
                } 
                 
            }
        }
        
        setTextareas(prev => ({...prev, 
            ['rule_11']: rules_11,
            ['rule_17']: rules_17,
            ['rule_19']: rules_19
        }))
        
    }


    const handleButtonCopy = (key: string) => {
        console.log('iptables',textareas[key])
        console.log(Array.isArray(textareas[key]),textareas[key].length)
        if (Array.isArray(textareas[key]) && textareas[key].length > 0) {
            console.log('Copy')
            navigator.clipboard.writeText(textareas[key].join('\n'))
                .then(() => {
                    console.log("复制成功！");
                })
                .catch((error) => {
                    console.error("复制失败：", error);
                });
        } else {
            console.log("当前内容为空，无法复制！");
        }
        
    }

    return (
        <div className="flex flex-col gap-2 w-full border-gray-300 border-2 rounded-lg p-4">
            <div className="flex justify-between">
                <h3 className="font-bold p-1">Iptables Rule</h3>
                <button 
                    className="outline-none bg-teal-400 p-2 pl-4 pr-4 rounded-lg hover:bg-teal-300 text-white mr-10"
                    onClick={handleButtonClick}
                >
                    生成规则
                </button>
            </div>
            <div className="flex flex-col p-1 gap-4"> 
                <div className="flex flex-col gap-2">
                    <label>vpn ip:</label>
                    <input 
                        type="text" 
                        placeholder="vpn ip，多个ip以逗号分割" 
                        className="p-1 w-1/3 rounded outline-none border-gray-300 border"
                        onChange={handleInputChange('vpnIp')}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label>目标IP和端口:</label>
                    {/* <input type="text" placeholder="一行一个. eg. 1.1.1.1/32 80,443,8080:8085" className="p-1 w-1/3 outline-none border-gray-300 border" /> */}
                    <textarea 
                        placeholder="一行一个. eg. 1.1.1.1/32 80,443,8080:8085" 
                        className="w-1/3 outline-none border-2 rounded-md p-1"
                        onChange={handleInputChange('target_ip_port')}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-4 items-center">
                        <span>30.11:</span>
                        <button 
                            className="p-1 pl-2 pr-2 outline-none bg-teal-400 text-white text-sm rounded-md"
                            onClick={() => handleButtonCopy('rule_11')}
                        >
                            复制
                        </button>
                    </div>
                    <textarea className="w-[80%] outline-none border-2 rounded-md p-1" defaultValue={textareas["rule_11"]? textareas['rule_11'].join('\n') : ""} />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-4 items-center">
                        <span>30.17:</span>
                        <button 
                            className="p-1 pl-2 pr-2 outline-none bg-teal-400 text-white text-sm rounded-md"
                            onClick={() => handleButtonCopy('rule_17')}
                        >
                            复制
                        </button>
                    </div>
                    <textarea className="w-[80%] outline-none border-2 rounded-md p-1" defaultValue={textareas["rule_17"] ? textareas['rule_17'].join('\n') : ""} />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-4 items-center">
                        <span>30.19:</span>
                        <button 
                            className="p-1 pl-2 pr-2 outline-none bg-teal-400 text-white text-sm rounded-md"
                            onClick={() => handleButtonCopy('rule_19')}
                        >
                            复制
                        </button>
                    </div>
                    <textarea className="w-[80%] outline-none border-2 rounded-md p-1" defaultValue={textareas["rule_19"] ? textareas["rule_19"].join('\n') : ""} />
                </div>
            </div>
        </div>
    )
}