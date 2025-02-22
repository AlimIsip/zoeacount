import UserInfoCard from "@/components/containers/UserInfoCard";
import { fetchUsersData } from "@/lib/data";
import { fetchCurrentUser, isRole } from "@/lib/sessiondetails";
import UsersTableWrapper from "@/components/UsersTableWrapper"; // Import wrapper

export default async function Profile() {
  const users = await fetchUsersData();
  const user = await fetchCurrentUser();
  const isAdmin = await isRole("admin");

  const columns = [
    { name: "USERNAME", uid: "username" },
    { name: "LAST LOGIN", uid: "last_login" },
    { name: "DATE JOINED", uid: "date_joined" },
    { name: "ROLE", uid: "role" },
    { name: "ACTIONS", uid: "actions" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 place-content-center bg-sky-950 text-amber-400">
      <div className="md:w-1/4 bg-sky-900 p-4 rounded-lg shadow-lg">
        <UserInfoCard user={user} />
      </div>
      {isAdmin && (
        <div className="md:w-3/4 bg-sky-900 p-4 rounded-lg shadow-lg">
          <UsersTableWrapper columns={columns} users={users} />
        </div>
      )}
    </div>
  );
}
