import express from 'express'
import {Request,Response} from 'express'

const app =express();
app.get('/',(req:Request,res:Response)=>{
    res.send('hi I am biswajit')
})

const port =8080

app.listen(port,()=>{
    console.log('server created successfully')
})