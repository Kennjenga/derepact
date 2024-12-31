// src/app/dashboard/page.tsx
import { getUser } from "@/lib/dal"; // Server-side function to fetch user data
import Dashboard from "@/components/Dashboard"; // Client component

export default async function DashboardPage() {
  let user = await getUser(); // Fetch user data on the server side

  if (user) {
    user = { ...user, uid: Number(user.uid) }; // Ensure uid is a number
  }

  if (!user) {
    // Redirect to login if user is not authenticated
    return (
      <div>
        <p>Redirecting to login...</p>
        <script>window.location.href = &quot;/login&quot;;</script>
      </div>
    );
  }

  return <Dashboard user={user} />; // Pass user data to the client component
}
