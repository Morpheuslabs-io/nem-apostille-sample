import express from 'express';
import apostilleRoutes from './apostille.routes';
import catapultRoutes from './catapult.routes';

const app = express();
const bodyParser = require('body-parser');
const port = 4000;
const host = '0.0.0.0';

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/apostille', apostilleRoutes.api);
app.use('/catapult', catapultRoutes.api);

app.listen(port, host);

console.log('Server started on port %s at %s', port, host);
console.log('Vist Catapult: ' + host + ':' + port + '/catapult');
console.log('Vist Apostille: ' + host + ':' + port + '/apostille');
