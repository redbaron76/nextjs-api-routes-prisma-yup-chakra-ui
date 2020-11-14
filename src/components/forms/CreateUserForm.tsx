import React from "react";
import { mutateNewData } from "src/utils/cache";
import { useForm } from "react-hook-form";
import { HTTP } from "src/utils/http";
import { setFormErrors } from "src/utils/validation";
import { useMutation, queryCache } from "react-query";
import {
  IUserCreate,
  IUserCreateErrors,
  IUserCreateResponse,
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

const CreateUserForm: React.FC = () => {
  const createUser = async (newUser: IUserCreate) => {
    const response = await HTTP("/api/user/create", "POST", {
      create: newUser,
    });
    return await response.json();
  };

  const [mutate, { isLoading }] = useMutation<
    IUserCreateResponse,
    IUserCreateErrors,
    IUserCreate,
    () => void
  >(createUser, {
    onMutate: (newUser) => mutateNewData<IUserCreate>("users", newUser),
    onError: (_errors, _newData, rollback) => rollback(),
    onSettled: () => queryCache.refetchQueries("users"),
  });

  const { handleSubmit, register, reset, errors, setError } = useForm<
    IUserCreate
  >();

  const onSubmit = async (input: IUserCreate) => {
    const data = await mutate(input);
    const { user, errors }: IUserCreateResponse = data;

    if (errors) return setFormErrors(errors, setError);

    reset();
    return user;
  };

  return (
    <>
      <Heading as="h2" size="lg">
        Register
      </Heading>
      <Box mt="10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isRequired isInvalid={!!errors.firstName}>
            <FormLabel>First name</FormLabel>
            <Input
              name="firstName"
              placeholder="Your first name"
              ref={register}
            />
            <FormErrorMessage>
              {errors.firstName && errors.firstName.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isRequired mt={4} isInvalid={!!errors.lastName}>
            <FormLabel>Last name</FormLabel>
            <Input
              name="lastName"
              placeholder="Your last name"
              ref={register}
            />
            <FormErrorMessage>
              {errors.lastName && errors.lastName.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isRequired mt={4} isInvalid={!!errors.email}>
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
          <FormControl isRequired mt={4} isInvalid={!!errors.password}>
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
          <FormControl isRequired mt={4} isInvalid={!!errors.confirmPassword}>
            <FormLabel>Confirm password</FormLabel>
            <Input
              name="confirmPassword"
              placeholder="Re-type your password"
              type="password"
              ref={register}
            />
            <FormErrorMessage>
              {errors.confirmPassword && errors.confirmPassword.message}
            </FormErrorMessage>
          </FormControl>
          <Button mt={10} width="full" isLoading={isLoading} type="submit">
            Register
          </Button>
        </form>
      </Box>
    </>
  );
};

export default CreateUserForm;
