export function getDateRange(type: "today" | "week" | "month" | "lastWeek" | "lastMonth") {
    const now = new Date();
    const start = new Date();
    const end = new Date();

    switch (type) {
        case 'today':
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'week':                                    // 本周，从周一到周日开始；
            const day = now.getDay();                   //  0 - Sunday 
            start.setDate(now.getDate() - day);         // 计算本周日的日期
            start.setHours(0, 0, 0, 0);                 // 本周日 00:00:00
            end.setHours(23, 59, 59, 999);              // 本周六 23:59:59（end是 now ）
            const mondayOffset = day === 0 ? 6 : 1 - day 
            start.setDate(now.getDate() + mondayOffset)
            start.setHours(0,0,0,0)
            end.setDate(now.getDate() + mondayOffset + 6)
            end.setHours(23,59,59, 999)
            break;

        case 'lastWeek':
            const lastWeekDay = now.getDay();
            // 先回退7天 → 上周
            start.setDate(now.getDate() - lastWeekDay - 7); // 上周日
            end.setDate(now.getDate() - lastWeekDay - 1);   // 上周六
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        
        case 'month':
            start.setDate(1);                          // 本月1号
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);            // 本月1号到今天（now）
            break;

        case 'lastMonth':
            end.setDate(0);                           // 上个月最后一天
            end.setHours(23, 59, 59, 999);
            start.setDate(1);
            start.setMonth(end.getMonth());
            start.setHours(0, 0, 0, 0);
            break;
        
        default:
        throw new Error('Invalid range type');
    }

    return { start, end }
}