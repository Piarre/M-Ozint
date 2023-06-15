import {
  Box,
  Button,
  Icon,
  List,
  ListItem,
  ModalCloseButton,
  ModalFooter,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import { AccountType } from "src/pages/lib/Types";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { Person } from "src/pages/lib/Types/Person";

const Email = ({
  isOpen,
  onOpen,
  onClose,
  accounts = [],
  person,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  accounts: AccountType[];
  person: Person;
}) => {
  const [acceptedAccounts, setAcceptedAccounts] = useState<AccountType[]>([]);

  const toast = useToast();

  const onAccountAccept = (provider: string) => {
    if (acceptedAccounts.some((account) => account.provider === provider)) {
      return;
    }
    setAcceptedAccounts((prevAcceptedAccounts) => [
      ...prevAcceptedAccounts,
      { provider },
    ]);
  };

  const onAccountRemove = (provider: string) => {
    setAcceptedAccounts((prevAcceptedAccounts) =>
      prevAcceptedAccounts.filter(
        (account: AccountType) => account.provider !== provider
      )
    );
  };

  const isAccountAccepted = (provider: string) => {
    return acceptedAccounts.some((account) => account.provider === provider);
  };

  const _onClose = () => {
    onClose();
    fetch(`http://localhost:8080/api/v1/people/${person.id}`, {
      method: "POST",
      body: JSON.stringify({
        accounts: acceptedAccounts,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    toast({
      title: `You added ${acceptedAccounts.length} account${
        acceptedAccounts.length > 1 ? "s" : ""
      } to ${person.first_name}.`,
      status: "success",
      duration: 1700,
      colorScheme: "green",
      isClosable: true,
    });
    setTimeout(() => window.location.reload(), 2000);
    setAcceptedAccounts([]);
    return;
  };

  return (
    <>
      <Modal isOpen={isOpen as boolean} onClose={_onClose as any} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody
            textAlign="center"
            alignContent="center"
            alignItems="center"
            justifyItems="center"
            justifyContent="center"
            p="8"
          >
            <p className="pb-4 font-extrabold text-xl">
              {accounts?.length == 0
                ? "No account founded"
                : accounts.length > 1
                ? "Accounts founded"
                : "Account founded"}
            </p>
            <Box display="flex" alignItems="center" justifyContent="center">
              {Array.isArray(accounts) && accounts.length > 0 ? (
                <List>
                  {accounts.map((account) => (
                    <ListItem
                      key={account.name}
                      className="cursor-pointer text-lg font-medium flex justify-between space-x-20"
                      textAlign="left"
                    >
                      <div style={{
                              opacity: !isAccountAccepted(account.provider)
                                ? 1
                                : 0.5,
                              transition: "opacity 0.2s ease",
                            }}>
                        {/* <ListIcon as={EmailIcon} /> */}
                        {account.provider.charAt(0).toUpperCase() +
                          account.provider.slice(1)}
                      </div>
                      <div className="space-x-2">
                        <Tooltip
                          label={
                            isAccountAccepted(account.provider) ? "" : "Accept"
                          }
                        >
                          <Icon
                            as={AddIcon}
                            boxSize="4"
                            onClick={() => onAccountAccept(account.provider)}
                            style={{
                              opacity: !isAccountAccepted(account.provider)
                                ? 1
                                : 0.5,
                              transition: "opacity 0.2s ease",
                            }}
                          />
                        </Tooltip>
                        <Tooltip
                          label={
                            !isAccountAccepted(account.provider) ? "" : "Reject"
                          }
                        >
                          <Icon
                            as={MinusIcon}
                            boxSize="4"
                            onClick={() => onAccountRemove(account.provider)}
                            style={{
                              opacity: isAccountAccepted(account.provider)
                                ? 1
                                : 0.5,
                              transition: "opacity 0.2s ease",
                            }}
                          />
                        </Tooltip>
                      </div>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <p>No account founded.</p>
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={_onClose}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Email;
