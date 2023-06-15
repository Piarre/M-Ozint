import { CircularProgress, ListItem } from "@chakra-ui/react";
import React from "react";
import { AccountType } from "src/pages/lib/Types";

const AccountModifier = ({ account }: { account: AccountType }) => {
  return (
    <>
      <ListItem
        key={account.provider}
        fontWeight="semibold"
        _hover={{ cursor: "pointer" }}
        className="align-middle flex"
      >
        <svg height="25" width="25" className="SVG__circle">
          <circle cx="12.5" cy="12.5" r="2" stroke="gray" stroke-width="3" />
        </svg>
        {account.provider.charAt(0).toUpperCase() + account.provider.slice(1)}
      </ListItem>
    </>
  );
};

export default AccountModifier;
