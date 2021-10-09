import { Flex, Box, Text, Avatar } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData: boolean;
}

export const Profile = ({ showProfileData = true }: ProfileProps) => {
  return (
    <Flex align='center'>
      {showProfileData && (
        <Box mr='4' textAlign='right'>
          <Text>Thales Morato</Text>
          <Text color='gray.300' fontSize='small'>
            tha.s.morato@gmail.com
          </Text>
        </Box>
      )}
      <Avatar size='md' name='Thales Morato' src='https://github.com/ThaSMorato.png' />
    </Flex>
  );
};
