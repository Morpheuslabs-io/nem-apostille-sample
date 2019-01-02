var express = require('express');
var api = express.Router();
const multer = require('multer');
import constant from './config';
import apostillService from './apostille.service';

/**
 * Apostille Service router
 */
api.get('/', function(req, res) {
  res.render('index');
});

api.get('/audit', function(req, res) {
  res.render('audit');
});

api.post(
  '/audit',
  multer(constant.config.multerAuditConfig).single('apostilleFile'),
  apostillService.auditFile
);

api.get('/download', apostillService.fileStorageList);

api.get('/download/:file(*)', apostillService.downloadFile);

api.post(
  '/upload',
  multer(constant.config.multerUploadConfig).single('file'),
  apostillService.createApostille
);

export default { api };
