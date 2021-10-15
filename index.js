const sha256 = require('crypto-js/sha256');

// create a simple block //
class Block {
    constructor(timestamp, transaction, previousHash = "") {
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.previousHash = previousHash
        this.hash = this.createHash()
        this.nonce = 0
    }

    // mining function //
    mineBlock(difficulty) {
        while (this.hash.substr(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++
            this.hash = this.createHash()
        }
        console.log("Mining Done :" + this.hash)
    }

    createHash() {
        return sha256(this.timestamp + this.transaction + this.previousHash + this.nonce).toString()
    }
}

// create Transition  class
class Transition {
    constructor(formAddress, toAddress, amount) {
        this.formAddress = formAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}

// create  simple block chain //
class BlockChain {
    constructor() {
        this.chain = [this.genarateGensisBlock()]
        this.difficulty = 5
        // pending transition
        this.pendingTransactions = []
        // miner reward //
        this.mineReward = 20
    }

    // for genesis block
    genarateGensisBlock() {
        return new Block("2021", "Genesis", "0000")
    }

    // get Last Hash For Previous Block
    getLastHash() {
        return this.chain[this.chain.length - 1]
    }

    createTransitions(transaction) {
        this.pendingTransactions.push(transaction)
    }

    minePendingTransactions(minerAddress) {
        const block = new Block(Date.now(), this.pendingTransactions)
        block.previousHash = this.getLastHash().hash
        block.mineBlock(this.difficulty)
        this.chain.push(block)
        this.pendingTransactions = [
            new Transition(null, minerAddress, this.mineReward)
        ]

    }

    // manually add block without transitions
    // addBlock(block) {
    //     block.previousHash = this.getLastHash().hash
    //     block.mineBlock(this.difficulty)
    //     this.chain.push(block)
    //
    // }

    isBlockChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const prevBlock = this.chain[i - 1]
            if (currentBlock.hash !== currentBlock.createHash()) {
                return false;
            }
            // console.log(prevBlock)
            if (currentBlock.previousHash !== prevBlock.hash) {
                return false;
            }

        }
        return true;


    }

    getBlanceOfAddress(address) {
        let blance = 0
        for (const block of this.chain) {
            for (const trans of block.transaction) {
                if (trans.formAddress === address) {
                    blance -= trans.amount
                }
                if (trans.toAddress === address) {
                    blance += trans.amount
                }

            }

        }
        return blance
    }

}

// const newBlock = new Block(Date.now(), {"Name": "Mizan", "Age": 27})
// const bblock = new Block(Date.now(), {"Name": "Mizan", "Age": 27})
// console.log(newBlock)
const abircoin = new BlockChain()
abircoin.createTransitions(new Transition("address1", "address2", 100))
abircoin.createTransitions(new Transition("address2", "address1", 50))
abircoin.minePendingTransactions("abir_com")
console.log(abircoin.getBlanceOfAddress("abir_com",))
abircoin.minePendingTransactions("abir_com")
console.log(abircoin.getBlanceOfAddress("abir_com",))




// console.log(abircoin)



