"use client";
import dynamic from "next/dynamic";

const UsersTable = dynamic(() => import("@/components/UsersTable"), {
  ssr: false, // Ensures this runs only on the client
});

export default function UsersTableWrapper({ columns, users }) {
  return <UsersTable columns={columns} users={users} />;
}
