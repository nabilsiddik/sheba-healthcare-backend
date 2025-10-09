import mongoose from 'mongoose'
import { app } from './app'
import { enVars } from './app/config/env'

const startServer = async() => {
    try{
        await 
    console.log('Connected To MongoDB')

    app.listen(enVars.PORT, () => {
        console.log(`Server is listening to port ${enVars.PORT}`)
    })
    }catch(error){
        console.log('Error while database connection.', error)
    }
}

(async() => {
    await startServer()
})()