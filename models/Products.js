const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, 'Please enter the product name'],
        trim: true,
      },
      brand: {
        type: String,
        required: false,
        trim: true,
      },
      category: {
        type: String,
        required: false,
        trim: true,
      },
      description: {
        type: String,
        required: [true, 'Please enter the product description'],
      },
      price: {
        type: Number,
        required: [true, 'Please enter the product price'],
        min: [0, 'Price cannot be negative'],
      },
      sizes: {
        type: [String],
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        required: [true, 'Please specify available sizes'],
      },
      colors: {
        type: [String],
        required: [true, 'Please specify available colors'],
      },
      images: [
        {
          url: {
            type: String,
            required: [true, 'Please provide the image URL'],
          },
          altText: {
            type: String,
            default: "mens clothing img"
          },
        },
      ],
      stockQuantity: {
        type: Number,
        required: [true, 'Please enter the stock quantity'],
        min: [0, 'Stock cannot be negative'],
      },
      ratingAverage: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating cannot exceed 5'],
        set: (val) => Math.round(val * 10) / 10, // Round to 1 decimal place
      },
      ratingQuantity: {
        type: Number,
        default: 0,
      },
      reviews: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
          },
          name: {
            type: String,
            required: false,
          },
          rating: {
            type: Number,
            required: false,
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
          },
          comment: {
            type: String,
            required: false,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      featured: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );
  
const Product = mongoose.model("Product", productSchema);
module.exports = Product; 