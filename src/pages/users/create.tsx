import { Box, Flex, Heading, Button, Divider, VStack, SimpleGrid, HStack } from "@chakra-ui/react";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { useMutation } from "react-query";
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";
import { useRouter } from "next/router";

type CreateUserFormData = {
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
};

const createUserFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatorio"),
  email: yup.string().required("E-mail obrigatorio").email("E-mail invalido"),
  password: yup.string().required("Senha obrigatoria").min(6, "Minimo de 6 caracteres"),
  password_confirmation: yup
    .string()
    .oneOf([null, yup.ref("password")], "As senhas precisam ser iguais"),
});

const CreateUser = () => {
  const router = useRouter();
  const createUser = useMutation(
    async (user: CreateUserFormData) => {
      const response = await api.post("users", {
        user: {
          ...user,
          created_at: new Date(),
        },
      });

      return response.data.user;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createUserFormSchema),
  });

  const { name, email, password, password_confirmation } = formState.errors;

  const handleCreateUser: SubmitHandler<CreateUserFormData> = async (values) => {
    await createUser.mutateAsync(values);

    router.push("/users");
  };

  return (
    <Flex direction='column' h='100vh'>
      <Header />
      <Flex w='100%' my='6' maxW={1480} mx='auto' px='6'>
        <Sidebar />

        <Box
          as='form'
          onSubmit={handleSubmit(handleCreateUser)}
          flex='1'
          borderRadius={8}
          bg='gray.800'
          p={["6", "8"]}>
          <Heading size='lg' fontWeight='normal'>
            Criar usuario
          </Heading>
          <Divider my='6' borderColor='gray.700' />
          <VStack spacing={["6", "8"]}>
            <SimpleGrid minChildWidth='240px' spacing={["6", "8"]} w='100%'>
              <Input name='name' label='Nome completo' {...register("name")} />
              <Input name='email' type='email' label='E-mail' {...register("email")} />
            </SimpleGrid>
            <SimpleGrid minChildWidth='240px' spacing={["6", "8"]} w='100%'>
              <Input name='password' type='password' label='Senha' {...register("password")} />
              <Input
                name='password_confirmation'
                type='password'
                label='Confirmacao de senha'
                {...register("password_confirmation")}
              />
            </SimpleGrid>
          </VStack>
          <Flex mt={["6", "8"]} justify='flex-end'>
            <HStack spacing='4'>
              <Link href='/users' passHref>
                <Button as='a' colorScheme='whiteAlpha'>
                  Cancelar
                </Button>
              </Link>
              <Button type='submit' colorScheme='pink' isLoading={formState.isSubmitting}>
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default CreateUser;
