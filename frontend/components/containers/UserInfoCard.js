import { Card, CardBody } from "@heroui/react";

export default function UserInfoCard({ user }) {
  return (
    <Card className="w-full max-w-sm p-4 shadow-md">
      <CardBody>
        <h3 className="text-lg font-semibold">User Information</h3>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Last Login:</strong> {user.last_login}</p>
        <p><strong>Date Joined:</strong> {user.date_joined}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </CardBody>
    </Card>
  );
}
