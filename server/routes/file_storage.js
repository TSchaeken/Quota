const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const gridFsStorage = require('multer-gridfs-storage');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const gfs = require('../database')
const port = 8080;

const storage = new gridFsStorage({
  url: gfs,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

router.get('/', (req, res) => {
  console.log('hit it');
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      res.render('index', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'application/pdf'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render('index', { files: files });
    }
  });
});

router.post('/upload', upload.single('file'), (req, res) => {
});

router.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }
    return res.json(files);
  });
});

router.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    return res.json(file);
  });
});

router.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    if (
      file.contentType === 'image/jpeg' ||
      file.contentType === 'application/pdf'
    ) {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      return res.status(404).json({
        err: 'Not an image or a pdf'
      });
    }
  });
});

router.delete('/files/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    res.redirect('/');
  });
});

module.exports = router;
