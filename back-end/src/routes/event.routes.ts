import { Router } from 'express'
import { EventController } from '../controllers/event.controller'
import { authMiddleware } from '../middleware/authMiddleware'

export const eventRouter = Router()

eventRouter.use(authMiddleware)

eventRouter.post('/', EventController.create)
eventRouter.get('/', EventController.list)
eventRouter.get('/:id', EventController.getById)
eventRouter.put('/:id', EventController.update)
eventRouter.delete('/:id', EventController.delete) 