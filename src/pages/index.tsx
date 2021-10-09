import { Flex, Button, Stack } from "@chakra-ui/react";
import { Input } from "../components/Form/Input";
import Head from "next/head";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatorio").email("E-mail invalido"),
  password: yup.string().required("Senha obrigatoria"),
});

export default function Home() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const { email, password } = formState.errors;

  const handleSignIn: SubmitHandler<SignInFormData> = (values) => {};

  return (
    <>
      <Head>
        <title>Dashgo | Home</title>
      </Head>
      <Flex w='100vw' h='100vh' align='center' justify='center'>
        <Flex
          as='form'
          w='100%'
          maxW='360px'
          bg='gray.800'
          p='8'
          borderRadius='8px'
          onSubmit={handleSubmit(handleSignIn)}
          flexDir='column'>
          <Stack spacing='4'>
            <Input name='email' type='email' label='E-mail' error={email} {...register("email")} />

            <Input
              name='password'
              type='password'
              error={password}
              label='Senha'
              {...register("password")}
            />
          </Stack>

          <Button
            type='submit'
            size='lg'
            mt='6'
            colorScheme='pink'
            isLoading={formState.isSubmitting}>
            Entrar
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
