import type { TipsData } from "@/types/tips"

interface TipInputProps {
    tip: TipsData,
    handleTipsItemInputChange: (tip: TipsData) => void
}




export default function TipInput({ tip, handleTipsItemInputChange }: TipInputProps) {
    const isChecked = tip.status === "done"

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, tip: TipsData) => {
        console.log("TipInput has changed: ", e.currentTarget.checked)
        handleTipsItemInputChange({...tip, status: e.currentTarget.checked ? "done": "pending"})
    }


    return (
        <label className="flex gap-2 text-xl items-center">
            <input type="checkbox" className="w-5 h-5"  checked={isChecked}  onChange={(e) => handleChange(e, tip)} />
            {tip.title}
        </label>
    )
}