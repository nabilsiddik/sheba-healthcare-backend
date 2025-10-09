import dotenv from 'dotenv'
dotenv.config()

interface EnvConfig {
    PORT: string,
    MONGODB_URI: string,
    LOCALHOST_CLIENT_URL: string,
    DEPLOYED_CLIENT_URL: string,
    JWT_ACCESS_SECRET: string
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVars: string[] = ['PORT', 'MONGODB_URI', 'LOCALHOST_CLIENT_URL', 'DEPLOYED_CLIENT_URL', 'JWT_ACCESS_SECRET']

    requiredEnvVars.forEach((key: string) => {
        if(!process.env[key]){
            throw new Error(`Env Variable ${key} is missing on .env file.`)
        }
    })

    return {
        PORT : process.env.port as string,
        MONGODB_URI: process.env.MONGODB_URI as string,
        LOCALHOST_CLIENT_URL: process.env.LOCALHOST_CLIENT_URL as string,
        DEPLOYED_CLIENT_URL: process.env.DEPLOYED_CLIENT_URL as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    }
}

export const enVars = loadEnvVariables()