//import Files from '../models/files';

import * as multer from 'multer';
import * as fs from 'fs';

var DIR = './uploads/';
var upload = multer({dest: DIR});

export default class FilesController {

  upload = (req, res) => {

  }
}
