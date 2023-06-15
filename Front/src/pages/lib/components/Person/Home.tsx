import {Flex, Icon, Link} from "@chakra-ui/react";
import {FiHome, FiPlus} from "react-icons/fi";

const Home = () => {
    return (
        <>
            <Link
                style={{textDecoration: "none"}}
                _focus={{boxShadow: "none"}}
                href="/"
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
                        as={FiHome}
                    />
                    Home
                </Flex>
            </Link>
        </>
    );
};

export default Home;
