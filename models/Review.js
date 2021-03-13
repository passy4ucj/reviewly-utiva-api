import mongoose from 'mongoose'


const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    apartment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Apartment',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})


// Static method to get avg rating and save
reviewSchema.statics.getAverageRating = async function(apartmentId) {
    const obj = await this.aggregate([
      {
        $match: { apartment: apartmentId }
      },
      {
        $group: {
          _id: '$apartment',
          averageRating: { $avg: '$rating' }
        }
      }
    ])
  
    try {
        if (obj[0]) {
            await this.model("Apartment").findByIdAndUpdate(apartmentId, {
            averageRating: obj[0].averageRating,
            });
        } else {
            await this.model("Apartment").findByIdAndUpdate(apartmentId, {
            averageRating: undefined,
            });
        }
    } catch (err) {
      console.error(err);
    }
  };

// Call getAverageRating after save
reviewSchema.post('save', async function() {
    await this.constructor.getAverageRating(this.apartment);
});
  
// Call getAverageRating after remove
reviewSchema.post('remove', async function () {
    await this.constructor.getAverageRating(this.apartment);
});


// Prevent user from submitting more than one review per apartment
reviewSchema.index({ apartment: 1, user: 1 }, { unique: true })


const Review = mongoose.model('Review', reviewSchema)

export default Review