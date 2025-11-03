import ServerDashboard from "@/components/Dashboard/ServerDashboard/ServerDashboard";
import MiddlewareDashboard from "@/components/Dashboard/MiddlewareDashboard/MiddleDashboard";


export default function Home() {

    return (
        <>
            <ServerDashboard />
            <MiddlewareDashboard />
        </>
    );
}
