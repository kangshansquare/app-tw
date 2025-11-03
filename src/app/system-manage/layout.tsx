import SystemManagerNav from "@/components/SystemManage/Nav"

export default function SystemManagerLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="min-h-screen bg-gray-50 p-8 space-y-6">
            <SystemManagerNav />
            {children}
        </section>
    )
}