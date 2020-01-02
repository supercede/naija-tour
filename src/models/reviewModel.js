import mongoose from 'mongoose';
import Tour from './tourModel';

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: [1, 'Rating cannot be less than 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, async function(next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name photo'
  // }).populate({
  //   path: 'tour',
  //   select: 'name'
  // });

  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});

//works on the model, not document
reviewSchema.statics.calcAverageRating = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//works when reviews are created but not when edited or deleted
//this.constructor refers to the model
reviewSchema.post('save', function() {
  //Review variable is not defined yet
  const Review = this.constructor;

  Review.calcAverageRating(this.tour);
});

//works when reviews are updated and deleted
//findByIdAndUpdate
//findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  //To find the document associated with this query and assign it to a as a property to the query
  //Reviews will be used in post middleware as updated results won't be returned in pre middleware
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  //To find the documnet associated with this query and assign it to a variable
  //calcAverageRating is only available on the model or constructor
  //this.findOne won't work in the post middleware because the query is already executed
  if (this.r) {
    this.r.constructor.calcAverageRating(this.r.tour);
  }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
