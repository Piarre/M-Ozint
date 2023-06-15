import { Person } from "./lib/Types/Person";
import SidebarWithHeader from "./lib/components/Navbar";
import Card from "./lib/components/Person/Card";
import { useEffect, useState } from "react";
import { SimpleGrid } from "@chakra-ui/react";

export default function Home() {
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

  return (
    <>
      <SidebarWithHeader>
        <SimpleGrid
          columns={[1, 2, 3]}
          minChildWidth="320px"
          spacing="7"
          className="p-7"
          justifyItems="center"
          alignItems="center"
        >
          {persons.map((person: Person) => (
            <Card person={person} key={person?.id} />
          ))}
        </SimpleGrid>
      </SidebarWithHeader>
    </>
  );
}
