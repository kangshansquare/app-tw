'use client';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ReactNode, useEffect } from 'react';

interface ModalPorps {
    show: boolean;
    onClose: () => void;
    children: ReactNode;
    widthClass?: string;
    title: string
}

export default function Modal({ show, onClose, children, widthClass = 'max-w-2xl', title }: ModalPorps) {


    if (!show) return null;
    return (
        ReactDOM.createPortal(
            <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50`} onClick={onClose}>
                <div className={`bg-white rounded-lg w-full ${widthClass} overflow-y-auto max-h-[80vh]`} onClick={e => e.stopPropagation()}>
                    <div className=''>
                        <div className='p-5 flex items-center justify-between'>
                            <h3 className='text-lg font-bold'>{title}</h3>
                            <button type='button' onClick={(e) => {e.preventDefault(); e.stopPropagation(); onClose()}}>
                                <FontAwesomeIcon icon={faXmark} className='text-lg' />
                            </button>
                        </div>
                    </div>
                    <div className='border border-gray-100' />
                    {children}
                </div>
            </div>,
            document.body
        )
    )

    


}