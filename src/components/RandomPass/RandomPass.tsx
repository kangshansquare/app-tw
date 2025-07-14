'use client';

import { useState } from "react";

export default function RandomPass() {
    const [lowerCase, setLowerCase] = useState<boolean>(true)
    const [upperCase, setUpperCase] = useState<boolean>(true)
    const [numberInput, setNumberInput] = useState<boolean>(true)
    const [specialChar, setSpecialChar] = useState<boolean>(false)

    const [excludeChar, setExcludeChar] = useState<boolean>(false)

    const [passwordLen, setPasswordLen] = useState<number>(8)

    const [password, setPassword] = useState<string>("")

    const handleLowerCaseInput = () => {
        setLowerCase(!lowerCase)
    }

    const handleUpperCaseInput = () => {
        setUpperCase(!upperCase)
    }

    const handleNumberInput = () => {
        setNumberInput(!numberInput)
    }
    const handleSpecialCharInput = () => {
        setSpecialChar(!specialChar)
    }

    const handleExcludeInput = () => {
        setExcludeChar(!excludeChar)
    }

    const handlePasswordLengthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const passLen = event.target.value;
        setPasswordLen(Number(passLen))
    }

    const generatePassword = (
        length: number,
        useLower: boolean,
        useUpper: boolean,
        useNumber: boolean,
        useSpecial: boolean,
        exclude: boolean
    ) => {
        let chars = '';
        if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useNumber) chars += '0123456789';
        if (useSpecial) chars += '!@#$%';

        // 排除字符
        if (exclude) {
            const excludeChars = 'iIl1o0O';
            chars = chars.split('').filter(c => !excludeChars.includes(c)).join('')
        }

        let pwd = '';
        for (let i = 0; i < length; i++) {
            const idx = Math.floor(Math.random() * chars.length);
            pwd += chars[idx]
        }

        return pwd;

    }

    const handleButtonClick = () => {
        if (!lowerCase && !upperCase && !numberInput && !specialChar) {
            alert("没有可以字符")
        }
        const pwd = generatePassword(
            passwordLen,
            lowerCase,
            upperCase,
            numberInput,
            specialChar,
            excludeChar
        );

        console.log(pwd)
        setPassword(pwd)

    }

    const handleButtonCopyPassword = () => {
        if (password) {
            navigator.clipboard.writeText(password)
                .then(() => {
                    console.log("复制成功！");
                })
                .catch((error) => {
                    console.error("复制失败：", error);
                });
        } else {
            console.log("当前密码为空，无法复制！");
        }
    }

    return (
        <div className="flex flex-col gap-2 w-full border-gray-300 border-2 rounded-lg p-4">
            <div className="flex justify-between">
                <h1 className="p-1 font-bold">Rondom Password</h1>
                <button 
                    className="outline-none bg-teal-400 p-2 pl-4 pr-4 rounded-lg hover:bg-teal-300 text-white mr-10"
                    onClick={handleButtonClick}
                >
                    生成密码
                </button>
            </div>
            <div className="flex p-1 justify-between">
                <div className="flex gap-5 items-center">
                    <div className="flex gap-2">
                        <span className="font-medium">所用字符</span>
                        <label className="flex gap-1 items-center">
                            <input type="checkbox" checked={lowerCase} onChange={handleLowerCaseInput}/>
                            a-z
                        </label>
                        <label className="flex gap-1 items-center">
                            <input type="checkbox" checked={upperCase} onChange={handleUpperCaseInput} />
                            A-Z
                        </label>
                        <label className="flex gap-1 items-center">
                            <input type="checkbox" checked={numberInput} onChange={handleNumberInput} />
                            0-9
                        </label>
                        <label className="flex gap-1 items-center">
                            <input type="checkbox" checked={specialChar} onChange={handleSpecialCharInput} />
                            !@#$%
                        </label>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-medium">排除字符</span>
                        <label className="flex gap-1 items-center">
                            <input type="checkbox" checked={excludeChar} onChange={handleExcludeInput} />
                            iIl1o0O
                        </label>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-medium">密码长度</span>
                        <select className="pl-1 outline-none border-gray-600 border-2 rounded-md" defaultValue="8" onChange={handlePasswordLengthChange}>
                            <option>8</option>
                            <option>10</option>
                            <option>12</option>
                            <option>16</option>
                            <option>20</option>
                            <option>24</option>
                        </select>
                    </div>
                </div>

                 
            </div>

            <div className="flex gap-4 p-1 items-center">
                <span className="font-medium">密码:</span>
                <input type="text" className="p-1 w-1/5 rounded-md outline-none border-gray-600 border-2" defaultValue={password}/>
                <button 
                    className="bg-gray-200 p-2 pl-4 pr-4 outline-none rounded-lg hover:bg-gray-100"
                    onClick={handleButtonCopyPassword}
                >
                    复制
                </button>
            </div>

        </div>
    )
}