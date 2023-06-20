import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    brand: {
        type: String, 
        reuired: true,
    },
    category: {
        type: String,
        ref: "Category",
        required: true,
    },
    sizes: {
        type: [String],
        enum: ["S", "M", "L", "XL", "XXL"],
        required: true,
    },
    colors: {
        type: [String],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
  
      images: [
        {
          type: String,
          required: true,
        },
      ],
  
      reviews: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Review",
        },
      ],
  
      price: {
        type: Number,
        required: true,
      },
      totalQty: {
        type: Number,
        required: true,
      },
      totalSold: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
    })
    //virtuals
    //total ratings 
    ProductSchema.virtual('totalReviews').get(function(){
      const product = this;
      return product?.reviews?.length;
    });
    //average rating
    ProductSchema.virtual('averageRating').get(function(){
      let totalRatings = 0;
      const product = this;
      product?.reviews?.forEach((review)=>{
        totalRatings += review?.rating;
      })
      //calculate average rating
      const averageRating = Number(totalRatings/product?.reviews?.length).toFixed(1);
      return averageRating;
    })
    ProductSchema.virtual("qtyLeft").get(function(){
      const product = this;
      return product.totalQty-product.totalSold;
    })

    const Product = mongoose.model("Product", ProductSchema);

    export default Product;