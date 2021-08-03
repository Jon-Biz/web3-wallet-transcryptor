import sigUtil from 'eth-sig-util'

class Eth {
  
  async init() {
    await this.initWallet()
    await this.getEncryptionKey()
  }

  async initWallet() {
    // Modern dapp browsers...
    if (window.ethereum) {
      this.web3Provider = window.ethereum
      try {
        // Request account access
        await window.ethereum.enable()
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      this.web3Provider = window.web3.currentProvider
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)
  }

  getEncryptionKey() {
    const getKeyP =
            new Promise(
              ( resolve
              , reject
                ) => {
                      const web3 = this.web3
                      const onResult =
                              ( error
                              , encryptionPublicKey
                              ) => {
                                    if (!error) {
                                      this.encryptionPublicKey = encryptionPublicKey.result

                                      resolve(void 0)
                                    } else {
                                      console.log(error)
                                      reject(error)
                                    }
                                   }

                      web3.eth.getAccounts(
                        ( error
                        , accounts ) => {
                        if (error) { console.log(error) }

                        web3.currentProvider.sendAsync({
                            jsonrpc: '2.0',
                            method: 'eth_getEncryptionPublicKey',
                            params: [accounts[0]],
                            from: accounts[0],
                          }
                        , onResult
                        )
                      })
                    }
            )

    return getKeyP
  }

  async generateKey() {
    // pseudocryption
    const val = Math.floor(100 * Math.random())

    return {
      publicKey: val
    , privateKey: -val
    }

    // const keyPair =
    //         await window.crypto.subtle
    //                 .generateKey(
    //                   {
    //                     name: "AES-GCM",
    //                     length: 256
    //                   },
    //                   true,
    //                   ["encrypt", "decrypt"]
    //                 )
    //                 .then(keys => {
    //                   debugger
    //                 })

      // console.log(keyPair)
      // debugger
      // return keyPair
    }

  async encrypt(data, key) {
    const dataStr = JSON.stringify(data)
    const dataArr = dataStr.split('')

    debugger
    const resultArr =
            dataArr
              .map(
                char => `${char.charCodeAt(0)+key}`
              )

    const result = resultArr.join()

    return result


    // const enc = new TextEncoder()
    // const encoded = enc.encode(message)
    //
    // // The iv must never be reused with a given key.
    // const iv = window.crypto.getRandomValues(new Uint8Array(12))
    //
    // const ciphertext = await window.crypto.subtle.encrypt(
    //   {
    //     name: "AES-GCM",
    //     iv: iv
    //   },
    //   key,
    //   encoded
    // )
    //
    // return ciphertext
  }

  async decrypt(ciphertext, key) {
    const cipherArr = ciphertext.split(',')
    const resultArr =
            cipherArr
              .map(
                charCode => {
                  const num = Number.parseInt(charCode)
                  return String.fromCharCode(num + key) }
              )

    const result = resultArr.join('')

    return JSON.parse(result)
    // const decrypted = await window.crypto.subtle.decrypt(
    //   {
    //     name: "AES-GCM",
    //     iv: iv
    //   },
    //   key,
    //   ciphertext
    // )
    //
    // const dec = new TextDecoder()
    // return dec.decode(decrypted)
  }

  async encryptUser(data) {

    const encryptedMessage =
            this.web3.toHex(
              JSON.stringify(
                sigUtil.encrypt(
                  this.encryptionPublicKey
                , { data }
                , 'x25519-xsalsa20-poly1305')
              )
            )

    return encryptedMessage
  }

  async decryptUser(encryptedData) {
    const dataP = new Promise(
      ( resolve
      , reject
        ) => {
        const web3 = this.web3

        web3.eth.getAccounts(
          ( error
          , accounts
            ) => {
                  if (error) { console.log(error) }

                  const account = accounts[0]

                  const payload = {
                    jsonrpc: '2.0',
                    method: 'eth_decrypt',
                    params: [encryptedData, account],
                    from: account
                  }

                  const onResponse =
                          ( error
                          , dataObj
                            ) => {
                                  if (error) { reject(error) }
                                  else {
                                    resolve(dataObj.result)
                                  }
                                 }

                  web3.currentProvider
                    .sendAsync(
                      payload
                    , onResponse
                    )
                 }
        )
      })

    return dataP
  }

  putRootAddr(userObj) {

    // const key      = userObj.publicKey
    // const response =
    //         await fetch(
    //           `REP_HOST_URL/set/${key}`
    //         , {
    //           method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //           mode: 'cors', // no-cors, *cors, same-origin
    //           cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //           credentials: 'same-origin', // include, *same-origin, omit
    //           headers: {
    //             'Content-Type': 'application/json'
    //             // 'Content-Type': 'application/x-www-form-urlencoded',
    //           },
    //           redirect: 'follow', // manual, *follow, error
    //           referrerPolicy: 'no-referrer', // no-referrer, *client
    //           body: JSON.stringify(userObj) // body data type must match "Content-Type" header
    //         })
    //
    // return await response.status // parses JSON response into native JavaScript objects
  }

  async getRootAddr() {
    const key = this.encryptionPublicKey

    const response =
            await fetch(
              `REP_HOST_URL/get/${key}`
            )

    const unencryptedAddr = this.decryptUser(await response.json())

    return unencryptedAddr
  }
}

export default Eth
