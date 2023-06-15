import {
  Heading,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Badge,
  useColorModeValue,
  List,
  Icon,
  useDisclosure,
  useToast,
  ModalBody,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInput,
  Select,
  FormControl,
  Input,
  Tooltip,
  UnorderedList,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  FiEdit2,
  FiMail,
  FiPhoneCall,
  FiSearch,
  FiTrash,
} from "react-icons/fi";
import { Person } from "../../Types/Person";
import dayjs from "dayjs";
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import Email from "./Resources/Email";
import LoadingModal from "../Utils/LoadingModal";
import { useState } from "react";
import { AccountType } from "../../Types";

const Card = ({ person }: { person: Person }) => {
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();
  const {
    isOpen: isSearchModalOpen,
    onOpen: onSearchModalOpen,
    onClose: onSearchModalClose,
  } = useDisclosure();
  const {
    isOpen: isSEmailOpen,
    onOpen: onSEmailOpen,
    onClose: onSEmailClose,
  } = useDisclosure();
  const {
    isOpen: isLoadingOpen,
    onOpen: onLoadingOpen,
    onClose: onLoadingClose,
  } = useDisclosure();
  const toast = useToast();
  const [foundedAccounts, setFoundedAccounts] = useState<AccountType[]>([]);

  const personToEdit: Person = {
    id: person.id,
    first_name: person.first_name,
    last_name: person.last_name,
    gender: person.gender,
    phone: person.phone,
    birthday: person.birthday,
    age: person.age,
    addresses: person.addresses,
    emails: person.emails,
    accounts: person.accounts,
  };

  const deletePerson = (toDelete?: boolean) => {
    if (toDelete) {
      fetch(`http://127.0.0.1:8080/api/v1/people/${person.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      onDeleteModalClose();
      toast({
        title: "Person deleted",
        description: `${person.first_name} ${person.last_name} has been deleted.`,
        status: "success",
        duration: 2000,
        colorScheme: "green",
        isClosable: true,
      });
      setTimeout(() => window.location.reload(), 2000);
    } else {
      onDeleteModalClose();
      toast({
        title: "Canceled",
        colorScheme: "red",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    }
  };

  const editPerson = (person: Person) => {
    fetch(`http://127.0.0.1:8080/api/v1/people/${person.id}`, {
      method: "PUT",
      body: JSON.stringify(person),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          onEditModalClose();
          toast({
            title: "Person edited",
            description: `${person.first_name} ${person.last_name} has been edited.`,
            status: "success",
            duration: 2000,
            colorScheme: "blue",
          });
          setTimeout(() => window.location.reload(), 2000);
        } else {
          onEditModalClose();
          toast({
            title: "Error",
            description: `Something went wrong.`,
            status: "error",
            duration: 2000,
            colorScheme: "red",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const searchByEmail = async (email: string) => {
    onSearchModalClose();
    onLoadingOpen();

    await fetch(`http://127.0.0.1:5000/email/${email}`)
      .then((res) => res.json())
      .then((data: any) => {
        data.provider.forEach((data: any) => {
          foundedAccounts.push({ provider: data });
        });
      });
    onLoadingClose();
    onSEmailOpen();
    return;
  };

  // Gray on selected

  return (
    <>
      <div>
        <Box
          w="320px"
          minHeight={"270px"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"2xl"}
          rounded={"xl"}
          p="8"
          textAlign={"center"}
        >
          <Heading fontSize={"2xl"} fontWeight="400">
            <Text as="p" fontWeight="bold">
              {person.first_name}
            </Text>{" "}
            {person.last_name}
          </Heading>
          <List spacing={2} py={4}>
            {person.addresses && (
              <Text textAlign={"center"} color="gray.400" px={3}>
                Live at{" "}
                <Text as="span" className="font-bold" color="gray.300">
                  {person.addresses}
                </Text>
              </Text>
            )}

            <Stack align={"center"} color="gray.300" textAlign="left">
              <List spacing="5.5px">
                {person.emails && (
                  <ListItem>
                    <ListIcon as={EmailIcon} />
                    <a
                      href={`mailto:${person.emails}`}
                      target="_blank"
                      rel="m-ozint"
                    >
                      {person.emails}
                    </a>
                  </ListItem>
                )}
                {person.phone && (
                  <ListItem>
                    <ListIcon as={PhoneIcon} />
                    <a href={`tel:${person.phone}`}>{person.phone}</a>
                  </ListItem>
                )}
              </List>
            </Stack>
          </List>

          <Stack align={"center"} justify={"center"} direction={"row"} py={4}>
            {person.birthday && (
              <Badge px={2} py={1} bg={"gray.600"} fontWeight={"400"}>
                Born on{" "}
                {new Date(person.birthday).toLocaleDateString().toString()}
              </Badge>
            )}

            {person.age && (
              <Badge px={2} py={1} bg={"gray.600"} fontWeight={"400"}>
                {person.birthday != ""
                  ? dayjs(person.birthday).diff(new Date(), "year") * -1
                  : person.age}{" "}
                years old
              </Badge>
            )}
          </Stack>

          <Stack
            mt={8}
            direction={"row"}
            spacing={16}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              fontSize={"sm"}
              rounded={"full"}
              h="10"
              w="10"
              _hover={{
                bg: "red.700",
              }}
              bg={"red.500"}
              onClick={onDeleteModalOpen}
            >
              <Icon as={FiTrash} />
            </Button>
            <Button
              fontSize={"sm"}
              h="10"
              w="10"
              rounded={"full"}
              bg={"blue.500"}
              color={"white"}
              onClick={onSearchModalOpen}
              boxShadow={
                "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
              }
              _hover={{
                bg: "blue.700",
              }}
              fontWeight="bold"
            >
              <Icon as={FiSearch} />
            </Button>
            <Button
              fontSize={"sm"}
              h="10"
              w="10"
              rounded={"full"}
              _hover={{
                bg: "gray.700",
              }}
              bg={"gray.500"}
              onClick={onEditModalOpen}
            >
              <Icon as={FiEdit2} />
            </Button>
          </Stack>
        </Box>
      </div>

      {/*
       // ! Delete modal 
      */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            Do you want to delete {person.first_name} {person.last_name}
          </ModalHeader>
          <ModalFooter>
            <Button
              colorScheme="red"
              variant="outline"
              mr={3}
              onClick={() => deletePerson(false)}
            >
              No
            </Button>
            <Button colorScheme="green" onClick={() => deletePerson(true)}>
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/*
       // ? Edit modal 
      */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            Editing {person.first_name} {person.last_name}
          </ModalHeader>
          <ModalBody>
            <FormControl>
              <div className="flex mb-2">
                <Input
                  placeholder="First name"
                  className="mr-4"
                  defaultValue={person.first_name as string}
                  onChange={(e) => (personToEdit.first_name = e.target.value)}
                />
                <Input
                  placeholder="Last name"
                  defaultValue={person.last_name}
                  onChange={(e) => (personToEdit.last_name = e.target.value)}
                />
              </div>
              <Select
                className="mb-2"
                defaultValue={person.gender}
                onChange={(e) => (personToEdit.gender = e.target.value)}
              >
                <option disabled>Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </Select>
              <div className="flex mb-2">
                <Input
                  placeholder="Phone"
                  type="tel"
                  defaultValue={person.phone}
                  style={{ flexBasis: "calc(50% - 25px)" }}
                  onChange={(e) => (personToEdit.phone = e.target.value)}
                />
              </div>

              <div className="flex mb-2">
                <Input
                  placeholder="Birthday"
                  className="mr-4"
                  type="date"
                  defaultValue={person.birthday}
                  style={{ flexBasis: "calc(50% + 115px)" }}
                  onChange={(e) => (personToEdit.birthday = e.target.value)}
                />
                <NumberInput
                  min={1}
                  max={99}
                  defaultValue={
                    person.birthday != ""
                      ? dayjs(person.birthday).diff(new Date(), "year") * -1
                      : person.age
                  }
                  style={{ flexBasis: "calc(50% - 115px)" }}
                  onChange={(e) => (personToEdit.age = +e)}
                >
                  <NumberInputField
                    type="number"
                    disabled={person.birthday != "" ? true : false}
                  />
                  <NumberInputStepper
                    display={person.birthday != "" ? "none" : "flex"}
                  >
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
              <Input
                placeholder="Address"
                className="mb-2"
                defaultValue={person.addresses}
                onChange={(e) => (personToEdit.addresses = e.target.value)}
              />
              <Input
                type="email"
                pattern="/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/"
                defaultValue={person.emails}
                placeholder="name@example.com"
                onChange={(e) => (personToEdit.emails = e.target.value)}
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
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => editPerson(personToEdit)}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 
      // ? Search modal 
      */}
      <Modal isOpen={isSearchModalOpen} onClose={onSearchModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Search {person.first_name} by</ModalHeader>
          <ModalBody>
            <Stack
              direction={"row"}
              spacing={16}
              justifyContent="center"
              alignItems="center"
            >
              <Tooltip
                label={
                  person.emails == ""
                    ? `Email not avaible for ${person.first_name}`
                    : ""
                }
              >
                <Button
                  colorScheme="blue"
                  onClick={() => searchByEmail(person.emails as any)}
                  isDisabled={person.emails == "" ? true : false}
                >
                  Email
                </Button>
              </Tooltip>
              <Tooltip
                label={
                  person.phone == ""
                    ? `Phone not avaible for ${person.first_name}`
                    : ""
                }
              >
                <Button
                  colorScheme="blue"
                  onClick={onSearchModalClose}
                  isDisabled={person.phone == "" ? true : false}
                >
                  Phone
                </Button>
              </Tooltip>
            </Stack>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      <Email
        isOpen={isSEmailOpen}
        onClose={() => {
          onSEmailClose();
          setFoundedAccounts([]);
        }}
        onOpen={onSEmailOpen}
        accounts={foundedAccounts as any}
        person={person}
      />
      <LoadingModal
        isOpen={isLoadingOpen}
        onClose={onLoadingClose}
        onOpen={onLoadingOpen}
        message="Fetching the web..."
      />
      {/* <SearchByMail isOpen={isOpen} /> */}
    </>
  );
};

export default Card;
