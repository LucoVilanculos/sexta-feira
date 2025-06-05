import React from 'react'
import {
  Box,
  Text,
  HStack,
  IconButton,
  useDisclosure,
  Avatar,
  VStack
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { Message } from '../types/Message'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { useChatStore } from '../stores/chatStore'

interface ChatMessageProps {
  message: Message
  isOwnMessage: boolean
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { deleteMessage } = useChatStore()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteMessage(message.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <>
      <Box
        alignSelf={isOwnMessage ? 'flex-end' : 'flex-start'}
        maxW="70%"
        position="relative"
      >
        <HStack
          spacing={2}
          align="flex-start"
          flexDirection={isOwnMessage ? 'row-reverse' : 'row'}
        >
          <Avatar
            size="sm"
            name={message.sender.name}
            src={message.sender.avatar}
          />
          <VStack
            align={isOwnMessage ? 'flex-end' : 'flex-start'}
            spacing={1}
          >
            <Box
              bg={isOwnMessage ? 'blue.500' : 'gray.100'}
              color={isOwnMessage ? 'white' : 'black'}
              px={4}
              py={2}
              borderRadius="lg"
              position="relative"
              _hover={{ '& > button': { opacity: 1 } }}
            >
              <Text>{message.content}</Text>
              {isOwnMessage && (
                <IconButton
                  aria-label="Delete message"
                  icon={<DeleteIcon />}
                  size="xs"
                  position="absolute"
                  top="-8px"
                  right="-8px"
                  opacity={0}
                  transition="opacity 0.2s"
                  bg="red.500"
                  color="white"
                  _hover={{ bg: 'red.600' }}
                  onClick={onOpen}
                />
              )}
            </Box>
            <Text fontSize="xs" color="gray.500">
              {formatTime(message.timestamp)}
            </Text>
          </VStack>
        </HStack>
      </Box>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDelete}
        title="Delete Message"
        itemName="message"
        isDeleting={isDeleting}
      />
    </>
  )
} 