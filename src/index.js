import encryptUtil from './encryptUtil'
import Web3 from 'web3'; 

class Transcryptor {

  constructor() {
    this.ready = this._init()
  }
  
  async _init() {

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
      this.web3Provider = 
        window.web3.currentProvider
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      this.web3Provider = 
        new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)
  }

  _getPublicKey() {

    const web3 = this.web3

    const retreivePublicKeyP = 
            ( resolve
            , reject
              ) => {
                    const onResult =
                            ( error
                            , encryptionPublicKey
                              ) => {
                                      if (!error) {
                                        this.encryptionPublicKey = 
                                              encryptionPublicKey.result

                                        resolve(void 0)    
                                      } else {
                                        
                                        console.error(error)
                                        reject(error)
                                      }
                                    }

                    web3.eth
                      .getAccounts(
                        ( error
                        , accounts 
                        ) => {
                              if (error) { console.error(error) }

                              const payload = {
                                jsonrpc: '2.0'
                              , method: 'eth_getEncryptionPublicKey'
                              , params: [accounts[0]]
                              , from: accounts[0]
                              }

                              web3.currentProvider.sendAsync(
                                payload                                
                              , onResult
                              )
                            }
                      )
                  }

    const getKeyP = 
            new Promise(retreivePublicKeyP)

    return getKeyP
  }

  async encryptPublicKey(dataObj) {
    await this.ready

    if (!this.encryptionPublicKey) await this._getPublicKey()

    const data = JSON.stringify(dataObj)

    const encryptedData = 
            encryptUtil
              .encrypt(
                this.encryptionPublicKey
              , data
              )

    const encryptedMessage =
            this.web3.utils
              .asciiToHex(
                JSON.stringify(
                  encryptedData
                )
              )

    return encryptedMessage
  }

  async decryptPrivateKey(encryptedData) {
    await this.ready

    const web3 = this.web3

    const decryptDataP = 
            ( resolve
            , reject
              ) => {
                      web3.eth
                        .getAccounts(
                            ( error
                            , accounts
                              ) => {
                                    if (error) { console.log(error) }

                                    const [ account ] = accounts

                                    const payload = {
                                      jsonrpc: '2.0'
                                    , method: 'eth_decrypt'
                                    , params: [encryptedData, account]
                                    , from: account
                                    }

                                    const onResponse =
                                            ( error
                                            , dataObj
                                              ) => {
                                                      if (error) { reject(error)           }
                                                      else       { resolve(dataObj.result) }
                                                    }

                                    web3.currentProvider
                                      .sendAsync(
                                        payload
                                      , onResponse
                                      )
                                  }
                            )
                    }
    const dataP = 
            new Promise( decryptDataP )

    return dataP
  }
}

export default Transcryptor
