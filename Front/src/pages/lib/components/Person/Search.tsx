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
  FormLabel,
  Divider,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { Person } from "../../Types/Person";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

const Search = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [searchInput, setSearchInput] = useState("");
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    const getPeople = async () => {
      await fetch("http://localhost:8080/api/v1/people")
        .then((res) => res.json())
        .then((json) => {
          setPersons(json);
        });
    };
    getPeople();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const filteredPersons = persons.filter((person: Person) => {
    return person?.first_name
      ?.toLowerCase()
      .includes(searchInput.toLowerCase());
  });

  const sortedPersons = filteredPersons.sort((a: any, b: any) => {
    return a.first_name.localeCompare(b.first_name);
  });

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
            as={FiSearch}
          />
          Search
        </Flex>
      </Link>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Looking for someone ?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl className="flex">
              <Input
                placeholder="Name"
                type="text"
                onChange={handleChange}
                value={searchInput}
                name="searchInput"
              />
            </FormControl>

            <TableContainer>
              <Table variant="striped" colorScheme="purple">
                <Thead>
                  <Tr>
                    <Th className="items-center flex">
                      Name{" "}
                      <TriangleDownIcon
                        fontSize="medium"
                        className="ml-[13px]"
                      />
                    </Th>
                    <Th isNumeric>ID</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedPersons.map((person: Person) => (
                    <>
                      <Tr key={person.id}>
                        <Td>
                          <Link href={`/person/${person.id}`}>
                            <Button variant="ghost">
                              {person.first_name} {person.last_name}
                            </Button>
                          </Link>
                        </Td>
                        <Td isNumeric>{person.id} </Td>
                      </Tr>
                    </>
                  ))}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>Name</Th>
                    <Th isNumeric>ID</Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Search;
