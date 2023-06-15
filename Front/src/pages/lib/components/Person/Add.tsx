import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Flex,
  Icon,
  Link,
  FormControl,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  CloseButton,
  Tooltip,
  ScaleFade,
  useToast,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";

const MailInput = ({
  mail,
  onRemove,
  onChange,
  onClick,
}: {
  mail: string;
  onRemove: () => void;
  onChange: (e: { target: { value: string } }) => void;
  onClick: boolean;
}) => {
  return (
    <ScaleFade in={onClick} initialScale={0.9}>
      <div className="flex my-2 items-center">
        <Input
          type="text"
          value={mail}
          className="mr-4"
          placeholder="name@example.com"
          onChange={onChange}
        />

        <Tooltip hasArrow label="Delete mail" rounded="lg" closeDelay={500}>
          <CloseButton onClick={onRemove} size="md" />
        </Tooltip>
      </div>
    </ScaleFade>
  );
};

const Add = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [mails, setMails] = useState([{ id: 0, value: "" }]);
  const toast = useToast();
  const person = {
    first_name: "",
    last_name: "",
    gender: "",
    phone: "",
    birthday: "",
    age: 0,
    addresses: "",
    emails: "",
  };

  const addPerson = () => {
    onClose();
    fetch("http://127.0.0.1:8080/api/v1/people", {
      method: "POST",
      body: JSON.stringify(person),
      headers: {
        "Content-Type": "application/json",
      },
    });
    toast({
      title: "Person added",
      description: `${person.first_name} ${person.last_name} has been added.`,
      status: "success",
      duration: 2000,
      colorScheme: "green",
      isClosable: true,
    });
    setTimeout(() => window.location.reload(), 2000);
  };

  const addInput = () => {
    const newMail = {
      id: Date.now(),
      value: "",
    };
    setMails([...mails, newMail]);
  };

  const removeInput = (idToRemove: number) => {
    setMails(mails.filter((mail) => mail.id !== idToRemove));
  };

  const handleMailChange = (id: number, newValue: string) => {
    setMails(
      mails.map((mail) => {
        if (mail.id === id) {
          return {
            ...mail,
            value: newValue,
          };
        }
        return mail;
      })
    );
  };

  return (
    <>
      <Link
        onClick={onOpen}
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          my="2"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          transition="all"
          transitionDuration=".3s"
          _hover={{
            bg: "purple.400",
            color: "white",
          }}
        >
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={FiPlus}
          />
          Add person
        </Flex>
      </Link>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New person</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <div className="flex mb-2">
                <Input
                  placeholder="First name"
                  className="mr-4"
                  onChange={(e) => (person.first_name = e.target.value)}
                />
                <Input
                  placeholder="Last name"
                  onChange={(e) => (person.last_name = e.target.value)}
                />
              </div>
              <Select
                className="mb-2"
                defaultValue="Gender"
                onChange={(e) => (person.gender = e.target.value)}
              >
                <option disabled>Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </Select>
              <div className="flex mb-2">
                <Input
                  placeholder="Phone"
                  type="tel"
                  style={{ flexBasis: "calc(50% - 25px)" }}
                  onChange={(e) => (person.phone = e.target.value)}
                />
              </div>

              <div className="flex mb-2">
                <Input
                  placeholder="Birthday"
                  className="mr-4"
                  type="date"
                  style={{ flexBasis: "calc(50% + 115px)" }}
                  onChange={(e) =>
                    (person.birthday = e.target.valueAsDate
                      ?.toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                      .toString() as string)
                  }
                />
                <NumberInput
                  min={1}
                  max={99}
                  defaultValue={1}
                  style={{ flexBasis: "calc(50% - 115px)" }}
                  onChange={(e) => (person.age = +e)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
              <Input
                placeholder="Address"
                className="mb-2"
                onChange={(e) => (person.addresses = e.target.value)}
              />
              <Input
                type="email"
                placeholder="name@example.com"
                onChange={(e) => (person.emails = e.target.value)}
              />
              {/* <div>
                {mails.map((mail) => (
                  <MailInput
                    key={mail.id}
                    mail={mail.value}
                    onRemove={() => removeInput(mail.id)}
                    onClick={true}
                    onChange={(e: { target: { value: string } }) =>
                      handleMailChange(mail.id, e.target.value)
                    }
                  />
                ))}
              </div> */}
            </FormControl>
          </ModalBody>

          <ModalFooter className=" justify-between">
            <Button onClick={() => addInput()} className="mr-4">
              Add mail
            </Button>
            <Button colorScheme="blue" mr={3} onClick={addPerson}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Add;
