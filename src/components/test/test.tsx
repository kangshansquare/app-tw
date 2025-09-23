// 'use client';

// import { useState, useEffect } from "react";

// export default function Test() {
//     const [ data, setData ] = useState<string | null>(null);
//     const [ loading, setLoading ] = useState<boolean>(true);

//     useEffect(() => {
//         async function getData() {
//             const res = await fetch('/api/test', { method: 'GET' });
//             const text = await res.text();
//             setData(text);
//             setLoading(false);
//         }
//         getData();
//     }, [])

//     if(loading) return <p>loading....</p>

//     return (
//         <p>{data}</p>
//     )
// }

'use client';

import useSWR from 'swr';

import { useContext } from 'react';
import {NotificationContext} from '@/context/NotificationContext';


// const fetcher = (url: string) => fetch(url).then(res => res.text())

const fetcher = async (url: string) => {
    
    const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',             // 让浏览器自动携带cookies
    })
    return res.text();
}

export default function TestComponent() {
    const { data, error, isLoading } = useSWR('/api/test', fetcher);

    const ctx = useContext(NotificationContext)    


    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;

    return (
        <div>
            <p>{data}</p>
            <button className='border border-gray-200 p-2'>显示通知消息</button>
        </div>
    );
}

