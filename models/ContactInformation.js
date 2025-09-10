import mongoose from 'mongoose';

const contactInformationSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    businessHours: {
      type: String,
      required: true,
    },
    whatsappNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const ContactInformation = mongoose.model(
  'ContactInformation',
  contactInformationSchema
);
