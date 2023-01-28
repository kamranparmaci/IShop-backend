import mongoose, { Schema } from 'mongoose';

const ReviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    perfume: {
      type: Schema.Types.ObjectId,
      ref: 'Perfume',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', ReviewSchema);

export default Review;
