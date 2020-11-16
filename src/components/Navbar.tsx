import React, { useContext } from "react";
import { useMutation, queryCache } from "react-query";
import { Box, Flex, Heading, Text, Link } from "@chakra-ui/core";
import { AuthContext } from "src/components/layouts/AuthLayout";
import { IAuthContext, IMeUser } from "src/interfaces/user";
import { HTTP } from "src/utils/http";

interface LogoutResponse {
  success: boolean;
}

const Navbar = (props: any) => {
  const { userLogged, userData, userId } = useContext(AuthContext);

  const logoutUser = async () => {
    const response = await HTTP("/api/auth/logout", "POST", {
      userId,
    });
    return await response.json();
  };

  const [logout] = useMutation<LogoutResponse>(logoutUser, {
    onSuccess: ({ success }) => {
      // reset AuthContext on logout
      if (success) return queryCache.setQueryData<IMeUser | null>("me", null);
    },
  });

  return (
    <Flex
      as="nav"
      justify="space-between"
      align="center"
      wrap="wrap"
      padding="1.5rem"
      bg="teal.500"
      color="white"
      {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg">
          Application
        </Heading>
      </Flex>
      <Box>
        <Text>{userData?.email || "Please, signup!"}</Text>
        {userLogged && (
          <Text>
            (<Link onClick={logout}>logout</Link>)
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default Navbar;
