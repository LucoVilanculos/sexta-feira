import React from 'react'
import {
  Box,
  Heading,
  Text,
  IconButton,
  HStack,
  useDisclosure,
  Switch,
  Badge
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Config } from '../types/Config'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { useConfigStore } from '../stores/configStore'

interface ConfigItemProps {
  config: Config
  onEdit?: (config: Config) => void
}

export const ConfigItem: React.FC<ConfigItemProps> = ({ config, onEdit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { deleteConfig } = useConfigStore()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteConfig(config.id)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        position="relative"
        transition="all 0.2s"
        _hover={{ shadow: 'md' }}
      >
        <HStack spacing={2} position="absolute" top={2} right={2}>
          {onEdit && (
            <IconButton
              aria-label="Edit configuration"
              icon={<EditIcon />}
              size="sm"
              variant="ghost"
              onClick={() => onEdit(config)}
            />
          )}
          <IconButton
            aria-label="Delete configuration"
            icon={<DeleteIcon />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={onOpen}
          />
        </HStack>

        <Heading size="md" mb={2} pr={16}>
          {config.name}
        </Heading>

        <Text color="gray.600" mb={3}>
          {config.description}
        </Text>

        <HStack spacing={4} mb={2}>
          <Badge colorScheme={config.category === 'system' ? 'blue' : 'green'}>
            {config.category}
          </Badge>
          {config.isRequired && (
            <Badge colorScheme="red">Required</Badge>
          )}
        </HStack>

        <HStack justify="space-between" align="center">
          <Text fontSize="sm" color="gray.500">
            Current Value: {config.value}
          </Text>
          {config.type === 'boolean' && (
            <Switch
              isChecked={config.value === 'true'}
              isDisabled
              size="sm"
            />
          )}
        </HStack>
      </Box>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDelete}
        title="Delete Configuration"
        itemName="configuration"
        isDeleting={isDeleting}
      />
    </>
  )
} 