import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  useToast
} from '@chakra-ui/react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  title: string
  itemName: string
  isDeleting?: boolean
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  isDeleting = false
}) => {
  const toast = useToast()

  const handleConfirm = async () => {
    try {
      await onConfirm()
      toast({
        title: 'Deleted successfully',
        description: `${itemName} has been deleted.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete item',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <Text>
            Are you sure you want to delete this {itemName}? This action cannot be undone.
          </Text>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose} isDisabled={isDeleting}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={handleConfirm}
            isLoading={isDeleting}
            loadingText="Deleting..."
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
} 