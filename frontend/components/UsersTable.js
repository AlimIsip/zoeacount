'use client';

import { useCallback, useState } from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  useDisclosure,
  Button,
} from "@heroui/react";

import DeleteIcon from "./icons/DeleteIcon";
import EditIcon from "./icons/EditIcon";
import PasswordIcon from "./icons/PasswordIcon";
import UserInfoModal from "./modals/UserInfoModal";
import ChangePasswordModal from "./modals/ChangePasswordModal";
import RegisterUserModal from "./modals/RegisterUserModal";

const statusColorMap = {
  admin: "bg-amber-500 text-black",
  staff: "bg-amber-300 text-black",
};

const formatDate = (dateString) => {
  return dateString ? format(new Date(dateString), "PPpp", { locale: enUS }) : "Not Available";
};

export default function UsersTable({ columns, users }) {
  const changePassModal = useDisclosure();
  const editModal = useDisclosure();
  const registerUserModal = useDisclosure();

  const [userDetails, setUserDetails] = useState();
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));

  const openEditModal = (id, username, role) => {
    editModal.onOpen();
    setUserDetails([{ id, username, role }]);
    setSelectedKeys(new Set([role]));
  };

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "date_joined":
        return formatDate(cellValue);
      case "last_login":
        return cellValue ? formatDate(cellValue) : <p className="opacity-50">Not yet logged in</p>;
      case "role":
        return (
          <Chip
            className={`capitalize px-3 py-1 rounded-md ${statusColorMap[user.role]}`}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex items-center gap-3">
            <Tooltip content="Edit user">
              <Button
                isIconOnly
                onPress={() => openEditModal(user.id, user.username, user.role)}
                className="bg-amber-500 hover:bg-amber-600 p-2 rounded-md"
              >
                <EditIcon />
              </Button>
            </Tooltip>
            <Tooltip content="Change password">
              <Button
                isIconOnly
                onPress={() => changePassModal.onOpen()}
                className="bg-blue-500 hover:bg-blue-600 p-2 rounded-md"
              >
                <PasswordIcon />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <Button
                isIconOnly
                color="danger"
                className="bg-red-500 hover:bg-red-600 p-2 rounded-md"
              >
                <DeleteIcon />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="w-full bg-sky-900 p-6 rounded-lg shadow-lg text-amber-400">
      {/* Register Button */}
      <div className="flex justify-end mb-4">
        <Button 
          color="primary" 
          onPress={registerUserModal.onOpen}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-md"
        >
          Register New User
        </Button>
      </div>

      {/* Users Table */}
      <Table className="w-full border border-sky-700 bg-sky-800 rounded-lg overflow-hidden">
        <TableHeader className="bg-sky-800 text-amber-400">
          {columns.map((column) => (
            <TableColumn  className="bg-sky-800 text-amber-400" key={column.uid} align="start">
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody className="divide-y divide-sky-700 bg-sky-800">
          {users.map((item) => (
            <TableRow key={item.id} className="even:bg-sky-900 odd:bg-sky-700 hover:bg-sky-800">
              {columns.map((col) => (
                <TableCell key={col.uid}>{renderCell(item, col.uid)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modals */}
      <UserInfoModal
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        userDetails={userDetails}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
      />

      <ChangePasswordModal
        isOpen={changePassModal.isOpen}
        onOpenChange={changePassModal.onOpenChange}
      />

      <RegisterUserModal
        isOpen={registerUserModal.isOpen}
        onOpenChange={registerUserModal.onOpenChange}
      />
    </div>
  );
}
