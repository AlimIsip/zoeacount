"use client";

import { useState } from "react";
import { changeUserPassword } from "@/lib/datapostput";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Input,
} from "@heroui/react";

export default function ChangePasswordModal({ isOpen, onOpenChange }) {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiResponse, setApiResponse] = useState(null);

  const getPasswordError = (value) => {
    if (value.length < 4) {
      return "Password must be 4 characters or more";
    }
    return null;
  };

  const getConfirmPasswordError = (value) => {
    if (value !== password) {
      return "Passwords do not match";
    }
    return null;
  };

  const onSubmitPassword = async (e, onClose) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const newErrors = {};

    if (!data.old_password) {
      newErrors.old_password = "Current password is required";
    }

    const passwordError = getPasswordError(data.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    const confirmPasswordError = getConfirmPasswordError(data.confirm_password);
    if (confirmPasswordError) {
      newErrors.confirm_password = confirmPasswordError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await changeUserPassword(
        data.old_password,
        data.password
      );
      setApiResponse(response);
      if (!response.error) {
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
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Change Password
              </ModalHeader>
              <Form
                className="w-full justify-center items-center space-y-4"
                validationBehavior="native"
                validationErrors={errors}
                onReset={() => setApiResponse(null)}
                onSubmit={(e) => onSubmitPassword(e, onClose)}
              >
                <ModalBody>
                  <Input
                    isRequired
                    label="CURRENT PASSWORD"
                    labelPlacement="inside"
                    name="old_password"
                    placeholder="Enter your current password"
                    type="password"
                    value={oldPassword}
                    onValueChange={setOldPassword}
                  />

                  <Input
                    isRequired
                    errorMessage={getPasswordError(password)}
                    isInvalid={getPasswordError(password) !== null}
                    label="NEW PASSWORD"
                    labelPlacement="inside"
                    name="password"
                    placeholder="Enter your new password"
                    type="password"
                    value={password}
                    onValueChange={setPassword}
                  />

                  <Input
                    isRequired
                    errorMessage={getConfirmPasswordError(confirmPassword)}
                    isInvalid={
                      getConfirmPasswordError(confirmPassword) !== null
                    }
                    label="CONFIRM PASSWORD"
                    labelPlacement="inside"
                    name="confirm_password"
                    placeholder="Confirm your new password"
                    type="password"
                    value={confirmPassword}
                    onValueChange={setConfirmPassword}
                  />

                  {apiResponse && (
                    <div className="text-small text-default-500 mt-4">
                      {apiResponse.error ? (
                        <div>
                          <p className="text-red-500">{apiResponse.error}</p>
                          <ul>
                            <li>
                              {" "}
                              Your password can’t be too similar to your other
                              personal information.
                            </li>
                            <li>
                              Your password must contain at least 8 characters.{" "}
                            </li>
                            <li>
                              Your password can’t be a commonly used password.
                            </li>
                            <li>Your password can’t be entirely numeric</li>
                          </ul>
                        </div>
                      ) : (
                        <p className="text-green-500">{apiResponse.message}</p>
                      )}
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setOldPassword("");
                    setPassword("");
                    setConfirmPassword("");
                    setErrors({});
                    setApiResponse(null);
                    onClose();
                  }}
                >
                  Cancel Changes
                </Button>
                  <Button color="primary" type="submit">
                    Save Changes
                  </Button>
                </ModalFooter>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
