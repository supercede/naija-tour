import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour name is required'],
      unique: true,
      trim: true
    },
    duration: {
      type: Number,
      required: [true, 'Tour duration is required']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Group Size is required for Tour']
    },
    difficulty: {
      type: String,
      required: [true, 'Tour Difficulty is required']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuanity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Tour price is required']
    },
    priceDiscount: Number,
    summary: {
      type: String,
      required: [true, 'Tour summary id required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'Tour must have a cover image']
    },
    images: [String],
    startDates: [Date]
  },
  {
    timestamps: { createdAt: true, updatedAt: false, select: false }
  }
);

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
