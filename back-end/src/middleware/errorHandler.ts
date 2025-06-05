import { PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

const prisma = new PrismaClient()

export async function registerUser({ email, password, name }: { email: string, password: string, name: string }) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new Error('Usuário já existe')
    }

    const user = await prisma.user.create({
      data: { email, password, name }
    })

    return user
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Email já cadastrado')
      }
    }
    throw error
  }
}