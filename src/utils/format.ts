import { omit } from "lodash";
import { UserWithProfile } from "src/types/user";
import { IMeUser } from "src/interfaces/user";

export const reduceMeUser = (user: UserWithProfile): IMeUser => {
  // Remove password and count from logged in user return
  return omit(user, ["password", "count"]);
};
