import {
  Box,
  Flex,
  Heading,
  Button,
  Icon,
  Table,
  Thead,
  Tr,
  Th,
  Checkbox,
  Tbody,
  Td,
  Text,
  Spinner,
  Link,
  useBreakpointValue,
} from "@chakra-ui/react";
import { RiAddLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import NextLink from "next/link";
import { getUsers, useUsers } from "../../services/hooks/useUsers";
import { useState } from "react";
import { queryClient } from "../../services/queryClient";
import { api } from "../../services/api";
import { GetServerSideProps } from "next";

const UserList = ({ users }) => {
  const [page, setPage] = useState(1);

  const { isLoading, error, data, isFetching } = useUsers(page, {
    initialData: users,
  });
  const isWideVersion = useBreakpointValue({ base: false, lg: true });

  const handlePrefetUser = async (userId: string) => {
    await queryClient.prefetchQuery(
      ["user", userId],
      async () => {
        const response = await api.get(`users/${userId}`);

        return response.data;
      },
      {
        staleTime: 1000 * 60 * 10,
      }
    );
  };

  return (
    <Flex direction='column' h='100vh'>
      <Header />
      <Flex w='100%' my='6' maxW={1480} mx='auto' px='6'>
        <Sidebar />

        <Box flex='1' borderRadius={8} bg='gray.800' p='8'>
          <Flex mb='8' justify='space-between' align='center'>
            <Heading size='lg' fontWeight='normal'>
              Usuarios
              {!isLoading && isFetching && <Spinner size='sm' color='gray.500' ml='4' />}
            </Heading>
            <NextLink href='/users/create' passHref>
              <Button
                as='a'
                size='sm'
                fontSize='sm'
                colorScheme='pink'
                leftIcon={<Icon as={RiAddLine} fontSize='20' />}>
                Criar Novo
              </Button>
            </NextLink>
          </Flex>

          {isLoading ? (
            <Flex justify='center'>
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify='center'>
              <Text>Falha ao obter os dados do usuario</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme='whiteAlpha'>
                <Thead>
                  <Tr>
                    <Th px={["4", "4", "6"]} color='gray.300' w='8'>
                      <Checkbox colorScheme='pink' />
                    </Th>
                    <Th>Usuario</Th>
                    {isWideVersion && <Th>Data de cadastro</Th>}
                  </Tr>
                </Thead>
                <Tbody>
                  {data.users.map((user) => (
                    <Tr key={user.id}>
                      <Td px={["4", "4", "6"]}>
                        <Checkbox colorScheme='pink' />
                      </Td>
                      <Td>
                        <Box>
                          <Link color='purple.400' onMouseEnter={() => handlePrefetUser(user.id)}>
                            <Text fontWeight='bold'>{user.name}</Text>
                          </Link>
                          <Text fontSize='sm' color='gray.300'>
                            {user.email}
                          </Text>
                        </Box>
                      </Td>
                      {isWideVersion && <Td>{user.createdAt}</Td>}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Pagination
                totalCountOfRegisters={data.totalCount}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default UserList;

export const getServerSideProps: GetServerSideProps = async () => {
  const { users, totalCount } = await getUsers(1);
  return {
    props: {
      users,
      totalCount,
    },
  };
};
