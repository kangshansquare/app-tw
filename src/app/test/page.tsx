// async function getData() {
//    try {
//         const res = await fetch('http://localhost:3000/api/test', {
//             method: 'GET'
//         })
//         if (!res.ok) {
//             throw new Error('Failed to fetch data');
//         }
//         return await res.text();
//    } catch (error) {
//        console.error('Error fetching data:', error);
//        return null;
//    }
// }

import TestComponent from "@/components/test/test"

export default  function Test() {
    


    return (
        <main>
            <TestComponent />
            
        </main>
    )
}