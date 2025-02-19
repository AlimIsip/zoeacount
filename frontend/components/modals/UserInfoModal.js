"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";

import { updateUser } from "@/lib/datapostput";

export default function UserInfoModal({
  isOpen,
  onOpenChange,
  userDetails,
  selectedKeys,
}) {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Directly compute selectedValue
  const selectedValue = Array.from(selectedKeys).join(", ").replace(/_/g, "");

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const newErrors = {};
    if (data.username === "admin") {
      newErrors.username = "Nice try! Choose a different username.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await updateUser(userDetails[0].id, data);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Edit User Info</ModalHeader>
            <ModalBody>
              <Form className="space-y-4" onSubmit={onSubmit}>
                <Input
                  isReadOnly
                  defaultValue={userDetails[0].id}
                  label="ID"
                  variant="flat"
                  name="id"
                />
                <Input
                  isRequired
                  label="USERNAME"
                  defaultValue={userDetails[0].username}
                  name="username"
                />
                <Select
                  isRequired
                  label="ROLE"
                  name="role"
                  placeholder={selectedValue}
                >
                  <SelectItem key="admin" value="admin">
                    Admin
                  </SelectItem>
                  <SelectItem key="staff" value="staff">
                    Staff
                  </SelectItem>
                </Select>

                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username}</p>
                )}
                <Button color="primary" type="submit" isLoading={loading}>
                  Save Changes
                </Button>
              </Form>
            </ModalBody>

            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
