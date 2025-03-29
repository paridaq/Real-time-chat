
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Room from './Room'
import ChatArea from './ChatArea'

function App() {
 

  return (
    <>
    <Routes>
      <Route path='/' element={<Room/>}/>
      <Route path='/chat'element={<ChatArea/>}/> 
    </Routes>
     
    </>
  )
}

export default App
