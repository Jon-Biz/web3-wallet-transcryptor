import nacl from 'tweetnacl'
import naclUtil from 'tweetnacl-util'

import Web3 from 'web3'; 

function encrypt(receiverPublicKey, msgParams, version) {
  switch (version) {
      case 'x25519-xsalsa20-poly1305': {
          if (typeof msgParams.data !== 'string') {
              throw new Error('Cannot detect secret message, message params should be of the form {data: "secret message"} ');
          }
          // generate ephemeral keypair
          const ephemeralKeyPair = nacl.box.keyPair();
          // assemble encryption parameters - from string to UInt8
          let pubKeyUInt8Array;
          try {
              pubKeyUInt8Array = naclUtil.decodeBase64(receiverPublicKey);
          }
          catch (err) {
              throw new Error('Bad public key');
          }
          const msgParamsUInt8Array = naclUtil.decodeUTF8(msgParams.data);
          const nonce = nacl.randomBytes(nacl.box.nonceLength);
          // encrypt
          const encryptedMessage = nacl.box(msgParamsUInt8Array, nonce, pubKeyUInt8Array, ephemeralKeyPair.secretKey);
          // handle encrypted data
          const output = {
              version: 'x25519-xsalsa20-poly1305',
              nonce: naclUtil.encodeBase64(nonce),
              ephemPublicKey: naclUtil.encodeBase64(ephemeralKeyPair.publicKey),
              ciphertext: naclUtil.encodeBase64(encryptedMessage),
          };
          // return encrypted msg data
          return output;
      }
      default:
          throw new Error('Encryption type/version not supported');
  }
}


class Transcryptor {

  constructor() {
    this.ready = this.init()
  }
  
  async init() {
    await this._initWallet()
    await this._getPublicKey()
  }

  async _initWallet() {
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

  _getPublicKey() {

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

                    web3.eth
                      .getAccounts(
                        ( error
                        , accounts 
                        ) => {
                              if (error) { console.log(error) }

                              web3.currentProvider.sendAsync({
                                  jsonrpc: '2.0',
                                  method: 'eth_getEncryptionPublicKey',
                                  params: [accounts[0]],
                                  from: accounts[0],
                                }
                              , onResult
                              )
                            }
                      )
                  }
            )

    return getKeyP
  }

  async generateKey() {
    await this.ready

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
    await this.ready

    const dataStr = JSON.stringify(data)
    const dataArr = dataStr.split('')

    const resultArr =
            dataArr
              .map(
                char => `${char.charCodeAt(0)+key}`
              )

    const result = resultArr.join()

    return result

    // const enc     = new TextEncoder()
    // const encoded = enc.encode(data)
    
    // // The iv must never be reused with a given key.
    // const iv = 
    //         window.crypto
    //           .getRandomValues(new Uint8Array(12))
    
    // const ciphertext = 
    //         await window.crypto.subtle.encrypt(
    //                 { name: "AES-GCM"
    //                 , iv: iv
    //                 }
    //               , key
    //               , encoded
    //               )
    
    // return ciphertext
  }

  async decrypt(ciphertext, key) {
    await this.ready

    const cipherArr = 
            ciphertext.split(',')

    const resultArr =
            cipherArr
              .map(
                charCode => {
                              const num = Number.parseInt(charCode)
                              const str = String.fromCharCode(num + key) 

                              return str
                            }
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
    
    // const dec = new TextDecoder()

    // return dec.decode(decrypted)
  }

  async encryptPublic(dataObj) {
    await this.ready

    const data = JSON.stringify(dataObj)

    const encryptedData = 
            encrypt(
              this.encryptionPublicKey
            , { data }
            , 'x25519-xsalsa20-poly1305'
            )

    const encryptedMessage =
            this.web3.utils.asciiToHex(
              JSON.stringify(
                encryptedData
              )
            )

    return encryptedMessage
  }

  async decryptPublic(encryptedData) {
    await this.ready

    const dataP = 
            new Promise(
                  ( resolve
                  , reject
                    ) => {
                          const web3 = this.web3

                          web3.eth
                            .getAccounts(
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
                        }
              )

    return dataP
  }
}

export default Transcryptor
