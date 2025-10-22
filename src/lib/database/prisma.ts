import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
    errorFormat: process.env.NODE_ENV === 'production' ? 'minimal' : 'pretty',
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper function to handle database disconnection
export async function disconnectPrisma() {
    await prisma.$disconnect()
}

// Helper function to check database connection
export async function checkDatabaseConnection() {
    try {
        await prisma.$queryRaw`SELECT 1`
        return { connected: true, error: null }
    } catch (error) {
        return { connected: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}
