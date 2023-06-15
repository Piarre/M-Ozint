import { AccountType } from ".";

export interface Person {
  id: number;
  first_name?: string;
  last_name?: string;
  emails?: string;
  gender?: string;
  phone?: string;
  addresses?: string;
  birthday?: string;
  age?: number;
  accounts: AccountType[];
}
