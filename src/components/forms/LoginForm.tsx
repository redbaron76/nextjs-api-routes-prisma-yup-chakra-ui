import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, queryCache } from "react-query";
import { HTTP } from "src/utils/http";
import {
  IUserLogin,
  IUserLoginError,
  IUserLoginResponse,
} from "src/interfaces/user";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/core";

const LoginForm: React.FC = () => {
  const loginUser = async (loginUser: IUserLogin) => {
    const response = await HTTP("/api/auth/login", "POST", {
      login: loginUser,
    });
    return await response.json();
  };

  const [mutate, { isLoading }] = useMutation<
    IUserLoginResponse,
    IUserLoginError,
    IUserLogin
  >(loginUser, {
    onSuccess: ({ user, error }) => {
      // update cache for "me" query
      if (user) return queryCache.setQueryData("me", user);
      // trigger error if not good login
      if (error) alert(error.message);
    },
  });

  const { handleSubmit, register, reset, errors, setError } = useForm<
    IUserLogin
  >();

  const onSubmit = async (login: IUserLogin) => {
    await mutate(login);
  };

  return (
    <>
      <Heading as="h2" size="lg">
        Login
      </Heading>
      <Box mt="10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mt={4} isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              placeholder="Your e-mail address"
              inputMode="email"
              ref={register}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl mt={4} isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              placeholder="Your password"
              type="password"
              ref={register}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Button mt={10} width="full" isLoading={isLoading} type="submit">
            Login
          </Button>
        </form>
      </Box>
    </>
  );
};

export default LoginForm;
