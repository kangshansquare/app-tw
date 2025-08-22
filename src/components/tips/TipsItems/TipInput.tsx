import type { TipsData } from "@/types/tips"

interface TipInputProps {
    tip: TipsData,
    handleTipsItemInputChange: (tip: TipsData) => void
}




export default function TipInput({ tip, handleTipsItemInputChange }: TipInputProps) {
    const isChecked = tip.status === "已完成"

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, tip: TipsData) => {
        console.log("TipInput has changed: ", e.currentTarget.checked)
        handleTipsItemInputChange({...tip, status: e.currentTarget.checked ? "已完成": "未完成"})
    }


    return (
        <label className="flex gap-2 text-xl items-center">
            <input type="checkbox" className="w-5 h-5"  checked={isChecked}  onChange={(e) => handleChange(e, tip)} />
            {tip.title}
        </label>
    )
}