var fs = require('fs');
import CryptoJS from 'crypto-js';
import { Account, NetworkType, TransactionHttp,TransferTransaction,Deadline,Address,PlainMessage,XEM } from 'nem2-sdk';
import {
  Initiator,
  PublicApostille,
  SHA256,
  Verifier,
} from 'apostille-library';
import constant from './config';

/**
 * Load all file in ./apostille directory
 */
const fileStorageList = (req, res) => {
  // create download route
  var path = require('path'); // get path
  var dir = path.resolve('.') + '/apostille/'; // give path
  fs.readdir(dir, function(err, list) {
    // read directory return  error or list
    if (err) return res.json(err);
    else res.render('download', { list: list });
  });
};

/**
 * Download file from ./apostille directory
 */
const downloadFile = (req, res, next) => {
  // this routes all types of file
  var path = require('path');
  var file = req.params.file;
  var path = path.resolve('.') + '/apostille/' + file;
  res.download(path);
};

/**
 * Audit File Serives
 * Retrive transaction hash from the file name.
 * using transaction hash search in blockchain, and doing audit with rawfile
 */
const auditFile = (req, res) => {
  let rawfile = CryptoJS.enc.Base64.parse(req.file.buffer.toString('base64'));
  let txHash = req.file.originalname.split('.')[0].split('-')[1];

  if (!req.file) {
    res.send('Message: ' + 'No file detected.');
  }

  if (!txHash) {
    res.send('Message: ' + 'Transaction hash is missing!');
  }

  const transactionHttp = new TransactionHttp(constant.config.nodeURL);

  transactionHttp.getTransaction(txHash).subscribe(
    result => {
      let payload = result.message.payload;
      let verify = Verifier.verifyPublicApostille(rawfile, payload);

      let messageInfo = [];
      messageInfo.push({
        message: 'file name: ' + req.file.originalname,
        txHash: txHash,
        AuditResult: verify ? 'Audit Successful' : 'Audit Fail!!!',
      });

      res.send(messageInfo);
    },
    err => res.send('Message: ' + 'invalid Transaction hash!')
  );
};

/**
 * Create Apostille Services
 * Reading the file and encrypt with Base64.
 * Using SHA256 to hash the raw file.
 * Announce hashed file info to Catapult blockchain.
 */

const createApostille = (req, res) => {
  let b64 = new Buffer(fs.readFileSync(req.file.path)).toString('base64');
  let rawfile = CryptoJS.enc.Base64.parse(b64);

  const privateKey = constant.config.userAccountprivateKey;

  const signer = Account.createFromPrivateKey(
    privateKey,
    NetworkType.MIJIN_TEST
  );

  const hashFunction = new SHA256();

  const initiator = new Initiator(signer);
  const publicApostille = new PublicApostille(
    initiator,
    req.file.originalname,
    constant.config.SinkAddress
  );

  publicApostille.update(rawfile, hashFunction);


  const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress(publicApostille.creationTransaction.recipient),
    [XEM.createRelative(0)],
    PlainMessage.create(publicApostille.creationTransaction.message.payload),
    NetworkType.MIJIN_TEST,
  );

  let signedTransaction = signer.sign(transferTransaction);

  const transactionHttp = new TransactionHttp(constant.config.nodeURL);

  transactionHttp.announce(signedTransaction).subscribe(
    x => {
      let originalname = req.file.originalname.split('.')[0];
      let ext = req.file.mimetype.split('/')[1];

      let rename =
        req.file.destination +
        '/' +
        originalname +
        '-' +
        signedTransaction.hash +
        '.' +
        ext;

      fs.rename(req.file.path, rename, function(err) {
        if (err) console.log('ERROR: ' + err);
      });

      let messageInfo = [];
      messageInfo.push({
        message: 'Successful Upload! ',
        txHash: signedTransaction.hash,
        file: rename,
      });

      res.send(messageInfo);
    },
    err => res.send('Message: ' + 'Something Wrong with for create Apostille')
  );
};

export default { fileStorageList, downloadFile, auditFile, createApostille };
