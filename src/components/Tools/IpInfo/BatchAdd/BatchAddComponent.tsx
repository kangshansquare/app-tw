'use client';

import  ReactDOM  from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faFile, faCheck, faFolder, faFilePen,faCircleInfo, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useRef, useState } from "react";
import { isValidIP } from "@/utils/isValidIP";
import { IpRecordResData } from "@/types/tools";

interface BatchAddComponentProps {
    show: boolean
    onClose: () => void
    onNotify: (type: 'success' | 'error' | 'info', message: string) => void
    onFetch:() => void
}

export default function BatchAddComponent({ show, onClose, onNotify, onFetch }: BatchAddComponentProps) {

    const [ fileName, setFileName ] = useState<string | null>(null)
    const [ text, setText ] = useState<{id: number,text: string, status: boolean}[] | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null);                  // 定义ref
    const handleButtonClick = () => {
        fileInputRef.current?.click()                                     // 使用ref调用input.click()
    }

    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fileExt = file.name.split(".").pop()?.toLocaleLowerCase();
        if (fileExt !== 'csv' && fileExt !== 'txt' && fileExt !== 'xlsx') {
            onNotify('error', '文件格式无效')
            return
        }
        setFileName(file.name)
        const reader = new FileReader();
        reader.onload = () => {
            const content = reader.result as string;
            const lines = content.split(/\r\n|\r|\n/).map(line => line.trim()).filter(line => line !== "");
            const seen = new Set<string>()    // 方便去重
            let nextId = 1;
            const result: {id: number,text: string, status: boolean}[] = []
            for (const line of lines) {
                if (seen.has(line)) {
                    continue
                }
                seen.add(line);
                result.push({
                    id: nextId++,
                    text: line,
                    status: isValidIP(line)
                })
            }
            setText(result)
        }
        reader.onerror = () => {
            onNotify('error', "读取文件失败");
            setText(null)
        }
        reader.readAsText(file, 'utf-8')
        
    }

    const handleDelete = (id: number) => {
        setText(prev => (prev ? prev.filter(i => i.id !== id) : prev));
    }

    const [ flag, setFlag ] = useState<'all' | 'valid' | 'invalid'>("all")
    const filteredText = useMemo(() => {
        if (!text) return [];
        if (flag === 'valid') return text?.filter(t => t.status);
        if (flag === 'invalid') return text?.filter(t => !t.status)
        return text;
    }, [text, flag])
    const totalCount = text?.length ?? 0;
    const validCount = text?.filter(t => t.status).length ?? 0
    const invalidCount = text?.filter(t => !t.status).length ?? 0
    const handleChangeFlage = (flag: 'all' | 'valid' | 'invalid') => {
        setFlag(flag)
    }

    const [ batchFlag, setBatchFlag ] = useState<"file" | "text">("file")
    const handleChangeBatchFlag = (flag: "file" | "text") => {
        if (batchFlag === flag) return;
        setBatchFlag(flag)
        setText(null)
        setFileName(null)
    }
    const [ textareaValue, setTextareaVlaue ] = useState<string>("")
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setTextareaVlaue(value)
    }
    const handleTextareaParsed = () => {
        if (textareaValue.trim() === "") return;
        const lines = textareaValue.split("\n").map(line => line.trim()).filter(line => line !== "");
        const seen = new Set<string>()    // 方便去重
        let nextId = 1;
        const result: {id: number,text: string, status: boolean}[] = []
        for (const line of lines) {
            if (seen.has(line)) {
                continue
            }
            seen.add(line);
            result.push({
                id: nextId++,
                text: line,
                status: isValidIP(line)
            })
        }
        setText(result)
    }
    const [ description, setDescription ] = useState<string>("")
    
    const handleImport = async () => {
        if (!text || text.length === 0) return
        const result: IpRecordResData[] = text.filter(item => item.status).map(item => ({
            ip: item.text,
            description: description || "无"
        }))
        
        try {
            const res = await fetch('/api/tools/ip-info', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result)
            })
            const data = await res.json()
            if (data.success) {
                onFetch()
                onClose()
                onNotify("success", String(data.message) || "创建成功")
            } else {
                onNotify("error", String(data.message) || "创建失败")
            }
        } catch(error) {
            onNotify("error", "网络异常")
        }
    }

    if (!show) return null;
    return ReactDOM.createPortal(
        <div className='fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center' onClick={onClose}>
            <div className=' bg-white rounded-lg w-full max-w-2xl overflow-y-auto max-h-[70vh]' onClick={e => e.stopPropagation()}>
                <div className="p-5 flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold">批量导入IP白名单</h3>
                        <button className="" onClick={onClose}>
                            <FontAwesomeIcon icon={faXmark} className="text-sm hover:bg-gray-100 p-1 rounded-full" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-2">
                            {/* <h3 className="font-bold">批量导入IP(先预览,再导入)</h3> */}
                            <button 
                                className={`flex items-center justify-center text-gray-500 gap-1 ${batchFlag === 'file' ? "bg-blue-600 text-white" : " bg-gray-200"} p-2 rounded-tl-lg`}
                                onClick={() => handleChangeBatchFlag('file')}
                            >
                                <FontAwesomeIcon icon={faFile} />
                                文件导入
                            </button>
                            <button
                                className={`flex items-center justify-center text-gray-500 gap-1 ${batchFlag === 'text' ? "bg-blue-600 text-white" : " bg-gray-200"} p-2 rounded-tr-lg`}
                                onClick={() => handleChangeBatchFlag('text')}
                            >
                                <FontAwesomeIcon icon={faFilePen} />
                                多行文本输入
                            </button>
                        </div>
                        
                        {
                            batchFlag === "file" ?
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-gray-500">步骤1: 选择待导入文件(.txt,每行一个IP)</span>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 px-4 bg-blue-700 text-white rounded-md flex gap-2 items-center" onClick={handleButtonClick}>
                                        <FontAwesomeIcon icon={faFolder} />
                                        选择文件
                                    </button>
                                    <input 
                                        type="file"                      // file
                                        ref={fileInputRef}               // ref
                                        accept=".csv,.txt,.xlsx"
                                        onChange={handleFileChange}
                                        aria-hidden="true"
                                        className="hidden"               // 默认样式难控制，隐藏input
                                    />
                                    { fileName ? <span className="text-sm text-gray-600">{fileName}</span> : <span className="text-sm text-gray-600">未选择文件</span>}
                                </div>
                                <span className="text-sm text-gray-500">步骤2: 待导入IP预览(可筛选、可删除无效项)</span>
                            </div> :
                            <div className="flex flex-col gap-3">
                                <span className="text-sm text-gray-500">输入待导入IP/IP段(每行一个,支持直接粘贴)</span>
                                <textarea 
                                    className="outline-none border border-gray-200 rounded-md p-2 min-h-32 text-sm text-gray-500"
                                    placeholder={"例如:\n192.168.1.100\n192.168.1.0/24"}
                                    rows={4}
                                    value={textareaValue}
                                    onChange={handleTextareaChange}
                                >

                                </textarea>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <FontAwesomeIcon icon={faCircleInfo} />
                                    提示：输入完成后点击下方「解析文本并预览」按钮查看结果
                                </span>
                                <div>
                                    <button className="p-2 px-4 bg-blue-600 rounded-lg text-white text-sm flex gap-1 items-center" onClick={handleTextareaParsed}>
                                        <FontAwesomeIcon icon={faWandMagicSparkles} />
                                        解析文本并预览
                                    </button>
                                </div>    
                            </div>
                        }
                        
                        <div className=" flex flex-col gap-2">
                            <label className="text-sm text-gray-600">IP用途描述</label>
                            <input 
                                className="outline-none p-2 border border-gray-200 rounded-md placeholder:text-sm hover:border-blue-300"
                                placeholder="IP地址用途描述 例如: CDN"
                                name="description"
                                value={description ?? ""}
                                onChange={e => setDescription(e.target.value.trim())}
                            />
                        </div>

                        <div className="flex flex-col border border-gray-200 rounded-md">
                            <div className="flex flex-col">
                                <div className="p-2 flex items-center justify-between border-b border-b-gray-200">
                                    <div className="flex gap-3">
                                        <button 
                                            className="p-1 px-2 border border-blue-300 bg-blue-200 text-blue-600 rounded-md text-xs"
                                            onClick={() => handleChangeFlage("all")}
                                        >
                                            全部 ({totalCount})
                                        </button>
                                        <button
                                            className="p-1 px-2 border border-green-300 bg-green-200 text-green-600 rounded-md text-xs"
                                            onClick={() => handleChangeFlage('valid')}
                                        >
                                            有效(可导入) ({validCount})
                                        </button>
                                        <button 
                                            className="p-1 px-2 border border-red-300 bg-red-200 text-red-600 rounded-md text-xs"
                                            onClick={() => handleChangeFlage('invalid')}
                                        >
                                            无效格式 ({invalidCount})
                                        </button>
                                    </div>
                                    <span className="text-xs text-gray-600">共{totalCount}条,有效可导入{validCount}条</span>
                                </div>
                                {
                                    text ?
                                    <div className="flex flex-col gap-2">
                                        <table className='w-full divide-y divide-gray-50'>
                                            <tbody className='bg-white divide-y divide-gray-200'>
                                                {
                                                    filteredText.map(line => (
                                                        <tr key={line.id} className='hover:bg-gray-50 transition-colors'>
                                                            <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                                <div className='flex items-center gap-2'>
                                                                    {
                                                                        line.status ? 
                                                                        <FontAwesomeIcon icon={faCheck} className="text-xs text-green-500" /> :
                                                                        <FontAwesomeIcon icon={faXmark} className="text-xs text-red-500" />
                                                                    }
                                                                    <span>{line.text}</span>
                                                                </div>
                                                            </td>
                                                            <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider align-top'>
                                                                <div className={`flex items-center `}>
                                                                    <span className={`p-1 px-2 rounded-md ${line.status ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                                                                        {line.status ? '有效' : '无效'}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className='px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>
                                                                <div className="flex items-center justify-center">
                                                                    <button className="text-xs text-red-600 hover:text-red-500" onClick={() => handleDelete(line.id)}>删除</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div> :
                                    <div className="flex items-center justify-center p-5">
                                        <span className="text-xs text-gray-600">请选择.txt文件查看预览</span>
                                    </div>
                                }

                            </div>
                            
                        </div>
                        <div className="flex items-center justify-end gap-5">
                            <button className="border border-gray-200 bg-gray-100 hover:bg-gray-200 p-2 px-4 rounded-md">取消</button>
                            <button className="bg-blue-600 p-2 px-4 rounded-md text-white hover:bg-blue-500" onClick={handleImport}>确认导入</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}