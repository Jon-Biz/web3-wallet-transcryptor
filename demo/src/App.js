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

  return (
    <div className="App">
      <header className="App-header">
          Metamask encryption/decryption demo app
      </header>
    </div>
  );
}

export default App;
