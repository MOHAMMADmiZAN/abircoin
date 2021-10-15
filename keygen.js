const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
// Generate keys
const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');
console.log(publicKey)
console.log(privateKey)
