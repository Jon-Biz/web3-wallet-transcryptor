import nacl from 'tweetnacl'
import naclUtil from 'tweetnacl-util'

function encrypt(receiverPublicKey, msg) {
    if (typeof msg !== 'string') {
        throw new Error('Msg must be a string');
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

    const msgParamsUInt8Array = naclUtil.decodeUTF8(msg);
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

export default { encrypt }