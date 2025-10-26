import { app } from './app'
import { envVars } from './app/config/env'

const startServer = async () => {
    try {
        app.listen(envVars.PORT, () => {
            console.log(`Server is listening to port ${envVars.PORT}`)
        })
    } catch (error) {
        console.log('Error while database connection.', error)
    }
}

(async () => {
    await startServer()
})()