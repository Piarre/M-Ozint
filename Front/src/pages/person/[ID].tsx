/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  VisuallyHidden,
  List,
  ListItem,
  Avatar,
} from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import VoidNavBar from "../lib/components/VoidNavbar";
import React, { useEffect, useState } from "react";
import { MdLocalShipping } from "react-icons/md";
import { Person } from "../lib/Types/Person";
import { useRouter } from "next/router";
import AccountModifier from "../lib/components/Person/Resources/AccountModifier";

const ID = () => {
  const router = useRouter();
  const { ID } = router.query;
  const [person, setPersonData] = useState<Person>();

  const doPersonExists = async (personId: any) => {
    await fetch(`http://127.0.0.1:8080/api/v1/people/${personId}`).then(
      async (res) => {
        setPersonData(await res.json());
      }
    );
  };

  useEffect(() => {
    doPersonExists(ID);
  }, [ID]);

  return (
    <>
      <VoidNavBar>
        <Container maxW={"7xl"}>
          <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: 8, md: 10 }}
            py={{ base: 18, md: 24 }}
          >
            <Flex>
              <Avatar
                rounded="lg"
                w={"100%"}
                h={{ base: "100%", sm: "400px", lg: "500px" }}
              />
            </Flex>
            <Stack spacing={{ base: 6, md: 10 }}>
              <Box as={"header"}>
                <Heading
                  lineHeight={1.1}
                  fontWeight={600}
                  fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
                >
                  {person?.first_name} {person?.last_name}
                </Heading>
                {person?.age && (
                  <Text color={"gray.400"} fontWeight={300} fontSize={"2xl"}>
                    AGE
                  </Text>
                )}
                {person?.age && (
                  <Text color={"gray.400"} fontWeight={300} fontSize={"2xl"}>
                    AGE
                  </Text>
                )}
              </Box>

              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={"column"}
                divider={
                  <StackDivider
                    borderColor={useColorModeValue("gray.200", "gray.600")}
                  />
                }
              >
                <VStack spacing={{ base: 4, sm: 6 }}>
                  {person?.addresses && (
                    <Text
                      color={"gray.500"}
                      fontSize={"2xl"}
                      fontWeight={"300"}
                    >
                      {person.addresses}
                    </Text>
                  )}
                </VStack>
                <Box>
                  <Text
                    fontSize={{ base: "16px", lg: "18px" }}
                    color={useColorModeValue("yellow.500", "yellow.300")}
                    fontWeight={"500"}
                    textTransform={"uppercase"}
                    mb={"4"}
                  >
                    ACCOUNTS
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                    <List spacing={2}>
                      {Array.isArray(person?.accounts) &&
                      person?.accounts.length! > 0 ? (
                        <>
                          {person?.accounts.map((account) => (
                            <AccountModifier
                              account={account}
                              key={account.provider}
                            />
                          ))}
                        </>
                      ) : (
                        <ListItem>No accounts found</ListItem>
                      )}
                    </List>
                  </SimpleGrid>
                </Box>
                <Box>
                  <Text
                    fontSize={{ base: "16px", lg: "18px" }}
                    color={useColorModeValue("yellow.500", "yellow.300")}
                    fontWeight={"500"}
                    textTransform={"uppercase"}
                    mb={"4"}
                  >
                    Person details
                  </Text>

                  <List spacing={2}>
                    {person?.emails && (
                      <>
                        <ListItem>
                          <Text as={"span"} fontWeight={"bold"}>
                            Email :
                          </Text>{" "}
                          {person.emails}
                        </ListItem>
                      </>
                    )}
                    {person?.phone && (
                      <>
                        <ListItem>
                          <Text as={"span"} fontWeight={"bold"}>
                            Phone number :
                          </Text>{" "}
                          {person.phone}
                        </ListItem>
                      </>
                    )}
                  </List>
                </Box>
              </Stack>

              {/* <Button
                rounded={"none"}
                w={"full"}
                mt={8}
                size={"lg"}
                py={"7"}
                bg={useColorModeValue("gray.900", "gray.50")}
                color={useColorModeValue("white", "gray.900")}
                textTransform={"uppercase"}
                _hover={{
                  transform: "translateY(2px)",
                  boxShadow: "lg",
                }}
              >
                Add to cart
              </Button> */}
            </Stack>
          </SimpleGrid>
        </Container>
      </VoidNavBar>
    </>
  );
};

export default ID;
