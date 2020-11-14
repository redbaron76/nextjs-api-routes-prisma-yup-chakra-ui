import Head from "next/head";
import { useQuery } from "react-query";
import { Box, Flex, List, ListItem } from "@chakra-ui/core";
import CreateUserForm from "src/components/forms/CreateUserForm";
import LoginForm from "src/components/forms/LoginForm";
import { User } from "@prisma/client";
import { HTTP } from "src/utils/http";

async function fetchUsers(): Promise<User[]> {
  const response = await HTTP("/api/user/get", "GET");
  const { users }: { users: User[] | [] } = await response.json();
  return users;
}

export default function Home() {
  const { data: users, error } = useQuery<User[]>("users", fetchUsers);

  if (error) return <span>Error loading data</span>;
  if (!users) return <span>Loading...</span>;

  return (
    <Box p="10">
      <Head>
        <title>App Demo ChakraUI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex>
        <Box flex="1" p="5">
          <CreateUserForm />
        </Box>
        <Box bg="gray.100" flex="1" p="5">
          <List>
            {users.map((user) => (
              <ListItem
                key={user.id}
              >{`${user.firstName} ${user.lastName} (${user.email})`}</ListItem>
            ))}
          </List>
        </Box>
        <Box flex="1" p="5">
          <LoginForm />
        </Box>
      </Flex>
    </Box>
  );
}
