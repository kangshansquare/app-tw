export default function LoadingComponent() {
    return (
        <div className="flex flex-col items-center gap-4 mt-5 h-[360px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"/>
            <p>加载中....</p>
        </div>
    )
}