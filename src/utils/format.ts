import { omit } from "lodash";
import { Profile, User } from "@prisma/client";
import { IMeUser } from "src/interfaces/user";

export const reduceMeUser = (
  user: User & {
    profile: Profile;
  }
): IMeUser => {
  // Remove password and count from logged in user return
  return omit(user, ["password", "count"]);
};
