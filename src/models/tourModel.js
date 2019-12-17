import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour name is required'],
      unique: true,
      trim: true,
      minlength: [10, 'Tour name must be at least 10 characters long'],
      maxlength: [50, 'Tour name cannot be more than 50 characters']
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
      required: [true, 'Tour Difficulty is required'],
      enum: {
        values: ['difficult', 'easy', 'medium'],
        message: 'Difficuty can only be one of easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating cannot be less than 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Tour price is required']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: 'Price Discount should npt be more than price'
      }
    },
    summary: {
      type: String,
      required: [true, 'Tour summary required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    secretTour: {
      type: Boolean,
      default: false
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

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// tourSchema.post(/^find/, function(docs, next) {
//   console.log(`This process took ${Date.now() - this.start}ms to complete`);
//   next();
// });

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
