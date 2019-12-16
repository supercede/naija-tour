import mongoose from 'mongoose';
import slugify from 'slugify';

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
    slug: String,
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
    ratingsQuantity: {
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: true, updatedAt: false, select: false }
  }
);

tourSchema.pre('save', function(next){
  this.slug = slugify(this.name, { lower: true });
  next();
})

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
