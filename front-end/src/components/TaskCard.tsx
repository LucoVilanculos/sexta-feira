import React from 'react'
import {
  Box,
  Heading,
  Text,
  Badge,
  IconButton,
  HStack,
  useDisclosure
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Task } from '../types/Task'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { useTasksStore } from '../stores/tasksStore'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { deleteTask } = useTasksStore()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteTask(task.id)
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
              aria-label="Edit task"
              icon={<EditIcon />}
              size="sm"
              variant="ghost"
              onClick={() => onEdit(task)}
            />
          )}
          <IconButton
            aria-label="Delete task"
            icon={<DeleteIcon />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={onOpen}
          />
        </HStack>

        <Heading size="md" mb={2} pr={16}>
          {task.title}
        </Heading>

        <Text noOfLines={2} mb={3} color="gray.600">
          {task.description}
        </Text>

        <HStack spacing={2}>
          <Badge colorScheme={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'}>
            {task.priority}
          </Badge>
          <Badge colorScheme={task.status === 'completed' ? 'green' : 'blue'}>
            {task.status}
          </Badge>
          {task.dueDate && (
            <Badge colorScheme="purple">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Badge>
          )}
        </HStack>
      </Box>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDelete}
        title="Delete Task"
        itemName="task"
        isDeleting={isDeleting}
      />
    </>
  )
} 