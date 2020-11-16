import React from "react";
import { useQuery } from "react-query";
import { Center, ChakraProvider, Spinner } from "@chakra-ui/core";
import { IAuthContext, IMeUser } from "src/interfaces/user";
import Navbar from "../Navbar";
import { User } from "@prisma/client";
import { HTTP } from "src/utils/http";

const initialContext: IAuthContext = {
  userLogged: false,
};

export const AuthContext: React.Context<IAuthContext> = React.createContext(
  initialContext
);

async function getLoggedUser(): Promise<IMeUser> {
  const response = await HTTP("api/auth/me", "POST");
  const { user }: { user: User | null } = await response.json();
  return user;
}

const AuthLayout: React.FC = ({ children }) => {
  const { data, isLoading } = useQuery<IMeUser>("me", getLoggedUser);
  return (
    <ChakraProvider>
      {isLoading ? (
        <Center w="100vw" h="100vh">
          <Spinner size="xl" label="Loading..." />
        </Center>
      ) : (
        <AuthContext.Provider
          value={{
            userId: data?.id || null,
            userData: data,
            userLogged: !!data,
          }}
        >
          <Navbar />
          {children}
        </AuthContext.Provider>
      )}
    </ChakraProvider>
  );
};

export default AuthLayout;
