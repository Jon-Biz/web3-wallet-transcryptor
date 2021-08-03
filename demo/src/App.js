import './App.css';
import React, { useState } from 'react'
import Transcryptor from 'transcryptor'

const transcryptor = new Transcryptor()

const App = () => {
  const [ text,          setText      ] = useState('your data here')
  const [ encryptedData, setEncrypted ] = useState('')
  const [ decryptedData, setDecrypted ] = useState('')

  const decryptData = async () => {
    setDecrypted('')

    const decryptedData = await transcryptor.decryptPublic(encryptedData)

    setDecrypted(decryptedData)
  }

  const encryptData = async () => {
    setEncrypted('')
    setDecrypted('')

    const encryptedData = await transcryptor.encryptPublic(text)

    setEncrypted(encryptedData)
  }

  return (
    <div className="App">
      <h1>
      Web3 wallet encryption/decryption demo app
        </h1>
      <p>
        Your data:
          <input onChange={e => setText(e.target.val)} value={text} type="text"></input>
          <button onClick={encryptData} >Encrypt with public key</button>
      </p>
      <p>
        Your encrypted data:
          { encryptedData }
          {
            (encryptedData.length !== 0)
            ? <button onClick={decryptData} >Decrypt</button>
            : null
          }
      </p>
      <p>
        Your decrypted data:
          { decryptedData }
      </p>
    </div>
  );
}

export default App;
