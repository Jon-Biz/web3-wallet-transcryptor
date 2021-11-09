# web3-wallet-transcryptor

Transcrypt user data with the user's wallet keypair.

Use your user's web3 wallet to encrypt and decrypt data.

## Usage

```javascript

import Transcryptor from 'transcryptor'

const transcryptor = new Transcryptor()

const data = 'hello world'

// Encrypt with public key

const encryptedPrivateData = await transcryptor.encryptDataPublicKey(data)
const decryptedPrivateData = await transcryptor.decryptDataPrivateKey(encryptedPrivateData)

assert.equal(data, decryptedPrivateData)

// Encrypt with private key

const encryptedPublicData = await transcryptor.encryptDataPrivateKey(data)
const decryptedPublicData = await transcryptor.decryptDataPublicKey(encryptedPublicData)

assert.equal(data, decryptedPublicData)

```

* On the first use of the public key in a session, the user will be asked to share their public key with your app.
* On every use of the private key for encryption or decryption, the user's web3 wallet will request user consent.
