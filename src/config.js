const multer = require('multer');

/**
 * config
 * nodeURL,nodeExplorer : change and point to your network.
 * SinkAddress: this is address to keep all Apostille Infomation
 * Multer: for apostille service file upload.
 * userAccountprivateKey: using for sign transaction, you should store this in .env
 */
const config = {
  nodeURL: 'http://docker.for.mac.host.internal:3000',
  nodeExplorer: 'http://docker.for.mac.host.internal:8000',
  SinkAddress: 'SB5V4ZNFPBA6JCXBJ6BF2RIF5DOBXAMR3LIWZ5XH',
  multerUploadConfig: {
    storage: multer.diskStorage({
      destination: function(req, file, next) {
        next(null, './apostille');
      },

      filename: function(req, file, next) {
        next(null, file.originalname);
      },
    }),
  },
  multerAuditConfig: { storage: multer.memoryStorage() },
  userAccountprivateKey:
    '143B617F464A159C359222315455B8648AC2E93FB70FFB370E2436875C6B1B66',
};

export default { config };
