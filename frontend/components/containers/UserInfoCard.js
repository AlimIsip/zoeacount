import { Card, CardBody } from "@heroui/react";

export default function UserInfoCard({ user }) {
  return (
<Card className="w-full h-full p-6 bg-sky-900 text-amber-400 rounded-lg shadow-lg">
  <CardBody>
    <h3 className="text-xl font-semibold mb-4 border-b border-amber-500 pb-2">
      User Information
    </h3>
    <div className="space-y-2 text-lg">
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Last Login:</strong> {user.last_login}</p>
      <p><strong>Date Joined:</strong> {user.date_joined}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  </CardBody>
</Card>

  );
}
