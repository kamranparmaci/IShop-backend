const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelPerfumeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      validate(value) {
        if (value < 0) {
          throw new Error('Price must be a positive number');
        }
      },
    },
    image: {
      type: String,
      required: true,
    },
    scent: {
      type: String,
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  { timestamp: true }
);

const Perfume = mongoose.model('Perfume', modelPerfumeSchema);

module.exports = Perfume;
