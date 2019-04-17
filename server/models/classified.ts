import * as mongoose from 'mongoose';

const classifiedSchema = new mongoose.Schema({
  userId: String,
  classifiedCategoryId: String,
  classifiedTitle: String,
  classifiedContent: String,
  classifiedMedia: String,
  classifiedTimestamp: Date,
  classifiedPrice: Number,
  classifiedValue: String,
  classifiedUrl: String,
  classifiedGeotag: String,
});

const Classified = mongoose.model('Classified', classifiedSchema);

export default Classified;
