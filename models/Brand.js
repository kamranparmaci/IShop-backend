import pkg from "mongoose";
const { Schema, model } = pkg;

const brandPerfumeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

const Brand = model("Brand", brandPerfumeSchema);

export default Brand;
