import React from 'react'
import {
  Box,
  Heading,
  Text,
  Badge,
  IconButton,
  HStack,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon, TimeIcon, LocationIcon } from '@chakra-ui/icons'
import { Event } from '../types/Event'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { useEventsStore } from '../stores/eventsStore'

interface EventCardProps {
  event: Event
  onEdit?: (event: Event) => void
}

export const EventCard: React.FC<EventCardProps> = ({ event, onEdit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { deleteEvent } = useEventsStore()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteEvent(event.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    return event.allDay
      ? d.toLocaleDateString()
      : d.toLocaleString()
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
        borderLeftWidth="4px"
        borderLeftColor={event.color || 'blue.500'}
      >
        <HStack spacing={2} position="absolute" top={2} right={2}>
          {onEdit && (
            <IconButton
              aria-label="Edit event"
              icon={<EditIcon />}
              size="sm"
              variant="ghost"
              onClick={() => onEdit(event)}
            />
          )}
          <IconButton
            aria-label="Delete event"
            icon={<DeleteIcon />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={onOpen}
          />
        </HStack>

        <VStack align="stretch" spacing={2}>
          <Heading size="md" pr={16}>
            {event.title}
          </Heading>

          <Text color="gray.600" noOfLines={2}>
            {event.description}
          </Text>

          <HStack spacing={4}>
            <HStack>
              <TimeIcon />
              <Text fontSize="sm">
                {formatDate(event.startDate)}
                {!event.allDay && ' - ' + formatDate(event.endDate)}
              </Text>
            </HStack>
            {event.location && (
              <HStack>
                <LocationIcon />
                <Text fontSize="sm">{event.location}</Text>
              </HStack>
            )}
          </HStack>

          <HStack spacing={2}>
            {event.allDay && <Badge colorScheme="purple">All Day</Badge>}
            {event.recurring && <Badge colorScheme="blue">Recurring</Badge>}
            {event.reminders && <Badge colorScheme="green">Reminders Set</Badge>}
          </HStack>
        </VStack>
      </Box>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDelete}
        title="Delete Event"
        itemName="event"
        isDeleting={isDeleting}
      />
    </>
  )
} 