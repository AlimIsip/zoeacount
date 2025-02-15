"use client";

import { Select, SelectItem } from "@heroui/react";
import { useState, useMemo } from "react";

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



export default function UserInfoModal({
  isOpen,
  onOpenChange,
  userDetails,
  selectedKeys,
}) {
 
  const [submitted, setSubmitted] = useState(null);
  const [errors, setErrors] = useState({});

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys]
  );

 

  const onSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    // Custom validation checks
    const newErrors = {};

    // Username validation
    if (data.name === "admin") {
      newErrors.name = "Nice try! Choose a different username";
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
                Edit User Info
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
                    isReadOnly
                    defaultValue={userDetails[0].id}
                    label="ID"
                    variant="bordered"
                  />

                  <Input
                    isRequired
                    label="USERNAME"
                    defaultValue={userDetails[0].username}
                  />

                  <Select
                    isRequired
                    label="ROLE"
                    labelPlacement="inside"
                    name="role"
                    placeholder={selectedValue}
                  >
                    <SelectItem key="ar" value="ar">
                      Admin
                    </SelectItem>
                    <SelectItem key="us" value="us">
                      Staff
                    </SelectItem>
                  </Select>
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
