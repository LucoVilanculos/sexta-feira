import { Request, Response, NextFunction } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { AppError } from '../utils/AppError'

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('Detalhes do erro:', {
    tipo: err.name,
    mensagem: err.message,
    caminho: req.path,
    método: req.method,
    stack: err.stack
  })

  // Tratar erros conhecidos da aplicação
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'erro',
      mensagem: err.message,
      código: err.code
    })
  }

  // Tratar erros do Prisma
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(400).json({
        status: 'erro',
        mensagem: 'Já existe um registro com este valor único'
      })
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'erro',
        mensagem: 'Registro não encontrado'
      })
    }
  }

  // Em desenvolvimento, enviar detalhes do erro
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({
      status: 'erro',
      mensagem: err.message,
      tipo: err.name,
      stack: err.stack,
      caminho: req.path,
      método: req.method
    })
  }

  // Em produção, enviar mensagem genérica
  res.status(500).json({
    status: 'erro',
    mensagem: 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.'
  })
}
