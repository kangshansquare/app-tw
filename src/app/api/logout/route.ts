import { Logout } from "@/lib/auth";

export async function POST() {
    return Logout();
}