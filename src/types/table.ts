export interface ColumnDef<T> {
    key: keyof T | string;
    header: string;
    width?: string;
    align?: 'left' | 'right' | 'center';
    render?: (item: T) => React.ReactNode;    // 可选的自定义渲染函数，如果不传则默认显示row[key]
}

export interface ActionHandlers<T> {
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
    onToggleStatus?: (item: T) => void;      // 
}

export interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    actions?: ActionHandlers<T>;
    loading?: boolean;
    showToggleStatus?: boolean;           // 
    statusKey?: keyof T;                  // 
    renderActions?: (row: T) => React.ReactNode;
}