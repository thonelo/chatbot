import { useState, useEffect } from 'react'
import './App.css'
import ChatBot from 'react-simple-chatbot';
import PropTypes from 'prop-types';
import axios from 'axios';


function App() {

  

  return (
    <div className="App">
      <header className="App-header">
        <ChatBot
          headerTitle="Consulta de estado de un productos"
          botAvatar="https://randomuser.me/api/portraits/lego/2.jpg"
          userAvatar="https://randomuser.me/api/portraits/lego/0.jpg"
          recognitionEnable={true}
          steps={[
            {
              id: 'greet', 
              message: 'Necesita registrarse para comenzar',
              trigger: '1'
            },  
            {
              id: '1',
              message: 'Ingrese un nombre de Usuario',
              trigger: 'name',
            },
            {
              id: 'name',
              user: true,
              trigger: 'pw',
            },
            {
              id: 'pw',
              message: 'Ingrese su contraseña',
              trigger: 'password',
            },
            {
              id: 'password',
              user: true,
              trigger: '3',
            },
            {
              id: '3',
              message: `Bienvenido, ¡Ingrese el id de algun producto!`,
              trigger: 'message' 
            },
            {
              id: 'message',
              user: true,
              validator: (value)=>{
                if(isNaN(value)){
                  return 'Enter a number'
                }
                return true
              }, 
              trigger: 'bot'
            },
            {
              id: 'bot',
              component: <FetchApi/>,
              asMessage: true,
              trigger: 'message'
            }
          ]}
        />        
      </header>
    </div>
  )
}

const FetchApi = props => {
  const { steps } = props
  const [status, setStatus] = useState(false)
  const [message, setMessage] = useState()
  
  const handleFetch = (prev)=>{
    axios.get('https://fakestoreapi.com/products/'+prev)
    .then( response=>{
        //console.log(response.data)
        if(response.data == null) setStatus(true)
        setMessage(response.data)
      }).catch( err =>{
        console.log(err)
      }).then(()=>{
        
      })
  }
  
  useEffect(()=>{ 
    handleFetch(steps.message.value)
  }, [])
  
  return(
    
    <div>
      
      {status ? <i>No Encontrado</i>:
      message &&
        <div>
        <i>{message.title}</i>
        <img src={message.image} style={{width:'100%'}}/>
        <hr/>
        <div style={{display:"flex" ,justifyContent:"space-between"}}>
        <b>Price: </b>
        <i>$ {message.price}</i>
        </div>
        <div style={{display:"flex" ,justifyContent:"space-between"}}>
        <b>Stock: </b>
        <i> {message.rating.count} </i>
        </div >
        
        </div>
      }

    </div>
  )
}

FetchApi.propTypes = {
  steps: PropTypes.object, 
}
FetchApi.defaultProps = {
  steps: undefined,
}

export default App
