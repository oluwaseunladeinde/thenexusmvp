// app/dashboard/page.tsx
import { currentUser } from '@clerk/nextjs/server'

export default async function Dashboard() {
    const user = await currentUser()

    return (
        <div className="p-6">
            <h1 className="text-2xl">Welcome, {user?.firstName || 'User'} 👋</h1>
        </div>
    )
}
