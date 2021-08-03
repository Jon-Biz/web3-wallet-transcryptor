import './App.css';
import Transcryptor from 'transcryptor'

function App() {

  const transcryptor = new Transcryptor()

  async function testDecryption(encryptedData) {
    const decryptedData = await transcryptor.decryptPublic(encryptedData)

    console.log({decryptedData})
  }

  async function testEncryption() {
    const data = { hello: 'world' }

    const encryptedData = await transcryptor.encryptPublic(data)

    console.log({encryptedData})
    testDecryption(encryptedData)
  }

  testEncryption()
  
  const encryptData = () => {
    alert('did the thing')
  }
  return (
    <div className="App">
          Metamask encryption/decryption demo app
      <p>
        Your data:
          <input type="text"></input>
          <button onClick={encryptData} >Encrypt</button>

      </p>
    </div>
  );
}

export default App;
