
import { createContext, useContext, useCallback, useState } from "react";


// 创建context，值是一个函数，该函数接收3个参数：
// message: 通知消息
// type: 通知类型，success、error、info
// position: 消息显示位置
type Position = 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right'
interface NotificationContextType {
    message: string;
    type: 'success' | 'error' | 'info';
    position: Position
}
// const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationContext = createContext('light')

// 创建provider


