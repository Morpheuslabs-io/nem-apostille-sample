import {
  Account,
  PublicAccount,
  Address,
  NetworkType,
  AccountHttp,
  TransferTransaction,
  QueryParams,
  TransactionHttp,
  PlainMessage,
  XEM,
  Deadline,
} from 'nem2-sdk';
import constant from './config';

/**
 * Load Account Infomation
 * Get latest 10 transaction
 */
const walletInit = (req, res) => {
  const accountHttp = new AccountHttp(constant.config.nodeURL);
  const privateKey = constant.config.userAccountprivateKey;

  const account = Account.createFromPrivateKey(
    privateKey,
    NetworkType.MIJIN_TEST
  );

  const publicAccount = PublicAccount.createFromPublicKey(
    account.publicKey,
    NetworkType.MIJIN_TEST
  );

  const pageSize = 10; // Page size between 10 and 100, otherwise 10

  accountHttp.transactions(publicAccount, new QueryParams(pageSize)).subscribe(
    transactions => {
      accountHttp.getAccountInfo(account.address).subscribe(
        account => {
          let walletInfo = [];
          walletInfo.push({
            address: account.address.plain(),
            publicKey: account.publicKey,
            mosaics: account.mosaics,
            tx: transactions,
            nodeExplorer: constant.config.nodeExplorer,
          });

          res.render('catapultWallet', { walletInfo: walletInfo });
        },
        err => res.send('Message: ' + 'invalid Address!')
      );
    },
    err => console.error(err)
  );
};

/**
 * Generate new Account
 */
const generateAccount = (req, res) => {
  const account = Account.generateNewAccount(NetworkType.MIJIN_TEST);

  let accountInfo = [];
  accountInfo.push({
    address: account.address.pretty(),
    privateKey: account.privateKey,
    publicKey: account.publicKey,
    Message: 'Remember to backup your privateKey.',
  });

  res.send(accountInfo);
};

/**
 * Send a transaction
 * 0 fees in private blockchain
 * @param {address} req
 * @param {xem} req
 * @param {message} req
 */
const sendTransaction = (req, res) => {
  let address = req.body.recipientAddress;
  let xem = parseFloat(req.body.xem);
  let message = req.body.message;

  const recipientAddress = Address.createFromRawAddress(address);

  const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    recipientAddress,
    [XEM.createRelative(xem)],
    PlainMessage.create(message),
    NetworkType.MIJIN_TEST
  );

  const privateKey = constant.config.userAccountprivateKey;

  const account = Account.createFromPrivateKey(
    privateKey,
    NetworkType.MIJIN_TEST
  );

  const signedTransaction = account.sign(transferTransaction);

  const transactionHttp = new TransactionHttp(constant.config.nodeURL);

  transactionHttp
    .announce(signedTransaction)
    .subscribe(
      x =>
        res.send(
          'Message: Successful announce, Txhash: ' + signedTransaction.hash
        ),
      err => console.error(err)
    );
};

/**
 * Get Transaction detail by TransactionHash
 * @param {tx} req
 */
const getTransactionByHash = (req, res) => {
  const transactionHttp = new TransactionHttp(constant.config.nodeURL);

  transactionHttp.getTransaction(req.params.tx).subscribe(
    result => {
      res.send(result);
    },
    err => res.send('Message: ' + 'invalid Transaction hash!')
  );
};

/**
 * Get Account status by Address
 * @param {address} req
 */
const getAccountStatus = (req, res) => {
  const accountHttp = new AccountHttp(constant.config.nodeURL);

  const accountAddress = Address.createFromRawAddress(req.params.address);

  accountHttp.getAccountInfo(accountAddress).subscribe(
    account => {
      res.send(account);
    },
    err => res.send('Message: ' + 'invalid Address!')
  );
};

export default {
  walletInit,
  generateAccount,
  sendTransaction,
  getTransactionByHash,
  getAccountStatus,
};
