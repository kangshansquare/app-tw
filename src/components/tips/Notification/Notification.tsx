'use client';
import ReactDOM  from "react-dom"
import { useEffect } from "react";
import { InfoCircleFilled, CheckCircleFilled, CloseCircleFilled  } from '@ant-design/icons';


interface NotificationProps {
    show: boolean
    closeNotification?: () => void
    duration?: number
    type?: "success" | "error" | "info"
    message?: string
}


export default function Notification({ show,closeNotification, duration = 2000, type, message }: NotificationProps) {

    if (!show)  return;

    useEffect(() => {
        if (show && closeNotification) {
            const timer = setTimeout(() => {
                closeNotification();
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [show, duration, closeNotification])



    return (
        ReactDOM.createPortal(
            <div className={`fixed bottom-8 right-8 z-[9999] bg-black/80 rounded-lg p-3 ${ show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20" } transform  transition-all duration-300`}>
                <div className="text-white w-full max-w-md   flex items-center justify-center gap-3">
                    { type === 'success' && <CheckCircleFilled  className="text-green-500"/> }
                    { type === 'error' && <CloseCircleFilled className="text-red-500" /> }
                    { type === 'info' && <InfoCircleFilled className="text-blue-500"/> }
                    <span>{message}</span>
                </div>
            </div>,
            document.body
        )
    )
}