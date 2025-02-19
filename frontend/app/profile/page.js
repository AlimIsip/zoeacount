import UsersTable from "@/components/UsersTable";
import UserInfoCard from "@/components/containers/UserInfoCard";
import { fetchUsersData } from "@/lib/data";
import { fetchCurrentUser } from "@/lib/sessiondetails"

export default async function Profile() {
  const users = await fetchUsersData();
  const user = await fetchCurrentUser(); // Fetch logged-in user

  const columns = [
    { name: "USERNAME", uid: "username" },
    { name: "LAST LOGIN", uid: "last_login" },
    { name: "DATE JOINED", uid: "date_joined" },
    { name: "ROLE", uid: "role" },
    { name: "ACTIONS", uid: "actions" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* User Info Card on the left */}
      <div className="md:w-1/4">
        <UserInfoCard user={user} />
      </div>

      {/* Users Table on the right */}
      <div className="md:w-3/4">
        <UsersTable columns={columns} users={users} />
      </div>
    </div>
  );
}
