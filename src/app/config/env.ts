import dotenv from 'dotenv'
dotenv.config()

interface EnvConfig {
    PORT: string,
    MONGODB_URI: string
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVars: string[] = ['PORT', 'MONGODB_URI']

    requiredEnvVars.forEach((key: string) => {
        if(!process.env[key]){
            throw new Error(`Env Variable ${key} is missing on .env file.`)
        }
    })

    return {
        PORT : process.env.port as string,
        MONGODB_URI: process.env.MONGODB_URI as string
    }
}

export const enVars = loadEnvVariables()