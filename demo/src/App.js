import './App.css';
import React, { useState } from 'react'
import Transcryptor from 'transcryptor'

const transcryptor = new Transcryptor()

const App = () => {
  const [ text, setText ] = useState('your data here')
  const [ encryptedData, setEncrypted ] = useState('')
  const [ decryptedData, setDecrypted ]  = useState('')

  async function testDecryption(encryptedData) {
    const decryptedData = await transcryptor.decryptPublic(encryptedData)

    console.log(decryptedData)
    return decryptedData
  }

  async function testEncryption(data) {
    const encryptedData = await transcryptor.encryptPublic(data)

    return encryptedData
  }
  
  const encryptData = async () => {
    const encryptedData = await testEncryption(text)
    setEncrypted(encryptedData)

    const decryptedData = await testDecryption(encryptedData)
    setDecrypted(decryptedData)
  }

  return (
    <div className="App">
      <h1>
      Web3 wallet encryption/decryption demo app
        </h1>
      <p>
        Your data:
          <input onChange={e => setText(e.target.val)} value={text} type="text"></input>
          <button onClick={encryptData} >Encrypt</button>
      </p>
      <p>
        Your encrypted data:
          { encryptedData }
      </p>
      <p>
        Your decrypted data:
          { decryptedData }
      </p>
    </div>
  );
}

export default App;
