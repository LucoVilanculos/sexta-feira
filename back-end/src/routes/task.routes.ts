import { Router } from 'express'
import { TaskController } from '../controllers/task.controller'
import { authMiddleware } from '../middleware/authMiddleware'

export const taskRouter = Router()

taskRouter.use(authMiddleware)

taskRouter.post('/', TaskController.create)
taskRouter.get('/', TaskController.list)
taskRouter.get('/:id', TaskController.getById)
taskRouter.put('/:id', TaskController.update)
taskRouter.delete('/:id', TaskController.delete) 