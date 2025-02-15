"use client"

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
} from "@heroui/react";

export default function ChangePasswordModal({isOpen, onOpenChange}) {
  const [submitted, setSubmitted] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  
  
  const getPasswordError = (value) => {
    if (value.length < 4) {
      return "Password must be 4 characters or more";
    }

    return null;
  };

  const getConfirmPasswordError = (value) => {
    if (value != password) {
      return "Passwords do not match";
    }
    return null;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    // Custom validation checks
    const newErrors = {};

    // Password validation
    const passwordError = getPasswordError(data.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Password validation
    const confirmPasswordError = getConfirmPasswordError(data.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and submit
    setErrors({});
    setSubmitted(data);
    onClose();
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
              <ModalBody>
                <Form
                  className="w-full justify-center items-center space-y-4"
                  validationBehavior="native"
                  validationErrors={errors}
                  onReset={() => setSubmitted(null)}
                  onSubmit={onSubmit}
                >
                    <Input
                      isRequired
                      errorMessage={getPasswordError(password)}
                      isInvalid={getPasswordError(password) !== null}
                      label="CHANGE PASSWORD"
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
                      name="password"
                      placeholder="Confirm your new password"
                      type="password"
                      value={confirmPassword}
                      onValueChange={setConfirmPassword}
                    />
           
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel Changes
                </Button>
                <Button color="primary" onPress={onClose} type="submit">
                  Save Changes
                </Button>
                {submitted && (
                  <div className="text-small text-default-500 mt-4">
                    Submitted data:{" "}
                    <pre>{JSON.stringify(submitted, null, 2)}</pre>
                  </div>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
