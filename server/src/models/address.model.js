import mongoose from 'mongoose';
import { Schema } from 'mongoose';

// Define the Address schema
const addressSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    addressType: {
      type: String,
      enum: ['home', 'work', 'friends & family', 'other'],
      required: true,
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    }
  },
  { timestamps: true }
);

// Create and export the Address model
const Address = mongoose.model('Address', addressSchema);
export default Address;
