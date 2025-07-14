'use client';

import { useEffect, useState } from "react";

export default function GenerSQL() {
    const [userList, setUserList] = useState<Array<string> | null>(null); 
    const [userlistBorderColor, setUserlistBorderColor] = useState<string | null>(null);

    const [hiveList, setHiveList] = useState<Array<string> | null>(null);
    const [dorisList, setDorisList] = useState<Array<string> | null>(null);
    const [textarealistBorderColor, setTextArealistBorderColor] = useState<string | null>(null);

    const [tipsInfo, setTipsInfo] = useState<string | null>(null);                        // 用户列表输入框为空时，提示信息“必选”
    const [textareaTipsInfo, setTextareaTipsInfo] = useState<string | null>(null);        // hive/doris输入框都为空时，提示信息

    const [copy53TipsInfo, setCopy53TipsInfo] = useState<string | null>(null);  
    const [copy55TipsInfo, setCopy55TipsInfo] = useState<string | null>(null);              
     
    const [genersql53, setGenersql53] = useState<Array<string> | null>(null);  
    const [genersql55, setGenersql55] = useState<Array<string> | null>(null);  
    
    const [SQLListLength, setSQLListLength] = useState<number | null>(null);

    useEffect(() => {
        setSQLListLength(genersql53?.length || 0);
    },[genersql53])

    const handlerButtonClick = () => {
        // 需要输入的input(用户名)中不能为空，否则红框提示
        // hive、doris输入框其中一个必须有输入；两者都为空，红框提示
        // 遍历用户数组生成SQL

        let sqlList53 = [];
        let sqlList55 = [];
        
        if (!userList) {
            setUserlistBorderColor("border-red-500 placeholder-red-500")
            setTipsInfo("必选")
        } else if (!hiveList && !dorisList) {
            setTextArealistBorderColor("border-red-500 placeholder-red-500")
            setTextareaTipsInfo("Hive 和 Doris库表信息不能都为空")
        } else {
            console.log('User list:', userList)
            console.log('Hive list:', hiveList?.map(item => "hive." + item))
            console.log("Doris list: ", dorisList) 

            const newHiveList = hiveList?.map(item => "hive." + item);
            const newDorisList = dorisList?.map(item => "internal." + item);

            const list = [...(newHiveList || []), ...(newDorisList || [])]
            
            for (const user of userList) {
                for (const table of list) {
                    sqlList53.push("grant SELECT_PRIV on " + table +  " " + "to " + user + "@'172.18.53.%';")
                    sqlList55.push("grant SELECT_PRIV on " + table +  " " + "to " + user + "@'172.18.55.%';")
                    
                }
            }
        }
        
        setGenersql53(sqlList53)
        setGenersql55(sqlList55)
    }

    const handlerInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // 输入用户名，多个用户以','分割（输入数据类型是string，最后转为数组类型）
        // 首先，删除开头或结尾的空格，输入长度不为0为有效数据
        // 长度不为0，且不包含','字符（str.includes(',') 包含返回true），表示只输入了一个用户
        const value = String(event.target.value).trim();
        console.log('user', userList)
        value.includes(',') ? setUserList(value.split(',')) : setUserList(value ? Array(value) : [])
    }

    const handlerHiveInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = String(event.target.value).trim();
        console.log('hive', value)
        value.includes('\n') ? setHiveList(value.split('\n')) : setHiveList(value ? Array(value) : [])
    }

    const handlerDorisInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = String(event.target.value).trim();
        console.log('doris', value)
        value.includes('\n') ? setDorisList(value.split('\n')) : setDorisList(value ? Array(value) : [])
    }

    const handlerCopySQL53 = () => {
        if (genersql53) {
            
            navigator.clipboard.writeText(genersql53.join('\n'))
                .then(() => {
                    console.log("复制成功~")
                })
                .catch((error) => {
                    console.log("复制失败: ", error)
                })
        } else {
            setCopy53TipsInfo("空的~~")
        }
    } 

    const handlerCopySQL55 = () => {
        if (genersql55) {
            
            navigator.clipboard.writeText(genersql55.join('\n'))
                .then(() => {
                    console.log("复制成功~")
                })
                .catch((error) => {
                    console.log("复制失败: ", error)
                })
        } else {
            setCopy55TipsInfo("空的~~")
        }
    }

    return (
        <div className='flex flex-col gap-3  p-4 border-gray-300 border-2 rounded-lg'>
            <div className='flex items-center justify-between'>
                <h3 className='p-1 font-bold'>Doris授权SQL生成器</h3>
                <button className='outline-none bg-teal-400 p-2 pl-4 pr-4 rounded-lg hover:bg-teal-300 text-white mr-10' onClick={handlerButtonClick}>
                    生成SQL
                </button>
            </div>
            <label htmlFor="username" className='p-1'>用户名：</label>
            <input
                type="text" 
                id="username" 
                name="username" 
                placeholder={`${tipsInfo ? tipsInfo : "输入用户名，多个用户使用逗号分割" }`}
                className={`border ${userlistBorderColor ? userlistBorderColor : "border-gray-300"} rounded p-1 w-1/2`}
                onChange={handlerInputChange}
            />
            <div className='flex gap-10'>
                <div className='flex-[1] flex flex-col gap-3'>
                    <p>Hive库表信息:</p>
                    <textarea 
                        placeholder={`${textareaTipsInfo ? textareaTipsInfo : '输入Hive库表信息,每行一个'}`}
                        className={`outline-none border-2 rounded-md p-1 ${textarealistBorderColor}`}
                        onChange={handlerHiveInputChange}
                    />
                </div>
                <div className='flex-[1] flex flex-col gap-3'>
                    <p>Doris库表信息:</p>
                    <textarea 
                        placeholder={`${textareaTipsInfo ? textareaTipsInfo :'输入Doris库表信息,每行一个'}`}
                        className={`outline-none border-2 rounded-md p-1 ${textarealistBorderColor}`}
                        onChange={handlerDorisInputChange}
                    />
                </div>
            </div>
            <div className='flex gap-10 justify-between'>
                <div className='flex-[1] flex flex-col gap-3'>
                    <label>172.18.53.%授权SQL:
                        <button 
                            className="ml-5 p-2 outline-none bg-teal-400 text-white text-sm rounded-md"
                            onClick={handlerCopySQL53}
                        >
                            复制SQL
                        </button>
                        {
                            copy53TipsInfo ? 
                            <span className="text-red-500 ml-5">{copy53TipsInfo}</span> : 
                            null
                        }
                    </label>
                    <textarea 
                        className='outline-none border-gray-100 border-2 rounded-md p-2' 
                        defaultValue={genersql53?.join('\n')}
                        rows={Math.max(SQLListLength || 0,2)}
                    />
                </div>
                <div className='flex-[1] flex flex-col gap-3'>
                    <label>172.18.55.%授权SQL:
                        <button 
                            className="ml-5 p-2 outline-none bg-teal-400 text-white text-sm rounded-md"
                            onClick={handlerCopySQL55}
                        >
                            复制SQL
                        </button>
                        {
                            copy55TipsInfo ? 
                            <span className="text-red-500 ml-5">{copy55TipsInfo}</span> : 
                            null
                        }
                        
                    </label>
                    <textarea 
                        className='outline-none border-gray-100 border-2 rounded-md p-2' 
                        defaultValue={genersql55?.join('\n')}
                        rows={Math.max(SQLListLength || 0,2)}
                    />
                </div>
            </div>
        </div>
    )
}