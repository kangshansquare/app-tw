import ReactDOM from "react-dom";

interface UpdateTipsProps {
    show: boolean
    onClose: () => void
    item: any
}


export default function UpdateTips({ show, onClose, item }: UpdateTipsProps) {
    console.log(item)
    return (
        ReactDOM.createPortal(
            <main className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
                <div className="w-1/2 h-1/2 bg-white rounded-md p-4 flex justify-between">
                    <h1>更新tips</h1>
                    <span onClick={onClose} className="hover:cursor-pointer">X</span>
                    
                </div>
                
            </main>,
            document.body
        )
    )
}