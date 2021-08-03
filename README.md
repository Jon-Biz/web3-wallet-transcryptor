# web3-wallet-transcryptor

Transcrypt user data with the user's wallet keypair.

## Usage

```

import Transcryptor from 'transcryptor'

const transcryptor = new Transcryptor()

const data = 'hello world'

// Encrypt with public key

const encryptedPrivateData = await transcryptor.encryptDataPublicKey(data)
const decryptedPrivateData = await transcryptor.decryptDataPrivateKey(encryptedData)

assert.equal(data, decryptedPrivateData)

///

```

* On the first use of the public key in a session, the user will be asked to share their public key with your app.
* On every use of the private key for encryption or decryption, the user will be for consent.