import { Request } from 'express'

declare global {
  namespace Express {
    interface User {
      id: string
      email: string
      name: string
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: Express.User | undefined
}

// Adiciona o tipo de usuário autenticado para o middleware
declare module 'express-serve-static-core' {
  interface Request {
    user?: Express.User
  }
}

declare namespace Express {
  export interface Request {
    user?: {
      id: string
      email: string
      name: string
    }
  }
} 