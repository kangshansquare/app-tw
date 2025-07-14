

export async function FetchTips(page: number = 1) {
    try {
            const res = await fetch(`/api/tips?page=${page}`, {
                method: 'GET'
            });
            const data = await res.json();

            if (data) {
                return data;
            } else {
                // console.log("获取数据失败")
                return {code: 10001, msg:"数据获取失败"}
            }
        } catch(e) {
            return {code: 20001, msg: e}
        }
}