var express = require('express');
var api = express.Router();
import catapultService from './catapult.service';

/**
 * Catapult Services Routes
 */
api.get('/generateaccount', catapultService.generateAccount);
api.get('/hash/:tx', catapultService.getTransactionByHash);
api.get('/account/:address', catapultService.getAccountStatus);

api.get('/', catapultService.walletInit);

api.post('/sendTransaction', catapultService.sendTransaction);

export default { api };
