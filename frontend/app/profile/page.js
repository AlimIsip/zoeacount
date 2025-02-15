import UsersTable from "@/components/UsersTable";
import { fetchUsersData } from "@/lib/data";

export default async function Profile(){

    const users = await fetchUsersData();
    const columns = [
        {name: "USERNAME", uid: "username"},
        {name: "LAST LOGIN", uid: "last_login"},
        {name: "DATE JOINED", uid: "date_joined"},
        {name: "ROLE", uid: "role"},
        {name: "ACTIONS", uid: "actions"},
      ];

    return(
        <div>
            <UsersTable columns={columns} users={users}/>
        </div>
    )

}