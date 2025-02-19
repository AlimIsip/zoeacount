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
import { createUser } from "@/lib/datapostput";

export default function RegisterUserModal({ isOpen, onOpenChange }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const [errors, setErrors] = useState({});
  const [apiResponse, setApiResponse] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (password.length < 4)
      newErrors.password = "Password must be at least 4 characters";
    return newErrors;
  };

  const onSubmit = async (e, onClose) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const response = await createUser({ username, password, role });
      setApiResponse(response);
      if (!response.error) {
        setUsername("");
        setPassword("");
        setRole("staff");
        setErrors({});
        onClose();
      }
    } catch (error) {
      setApiResponse({
        error:
          error.message || "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Register New User
            </ModalHeader>
            <ModalBody>
              <Form
                className="space-y-4"
                onSubmit={(e) => onSubmit(e, onClose)}
              >
                <Input
                  label="Username"
                  name="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  isInvalid={errors.username}
                  errorMessage={errors.username}
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={errors.password}
                  errorMessage={errors.password}
                />
                <Select
                  label="Role"
                  name="role"
                  selectedKey={role}
                  onSelectionChange={setRole}
                >
                  <SelectItem key="admin" value="admin">
                    Admin
                  </SelectItem>
                  <SelectItem key="staff" value="staff">
                    Staff
                  </SelectItem>
                </Select>
                <Button color="primary" type="submit">
                  Register
                </Button>
              </Form>
              {apiResponse && (
                <p
                  className={`text-sm mt-2 ${
                    apiResponse.error ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {apiResponse.error || apiResponse.message}
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
