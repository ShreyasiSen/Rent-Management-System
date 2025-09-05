import mongoose, { Schema, model, models } from "mongoose";

const customerSchema = new Schema(
  {
    name: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    address: { type: String, required: false },
    aadharNumber: { type: String, required: false },
    yearOfEngagement: { type: String, required: false },
    advancedMoney: { type: Number, required: false },
    startingRent: { type: Number, required: false },   // ✅
    currentRent: { type: Number, required: false },
    increasePercentage: { type: Number, required: false },
    yearsUntilIncrease: { type: Number, required: false },
    // reminderDate: { type: Date, required: false },     // ✅ must be Date
    previousIncrementDate: { type: Date, required: false }, // ✅ must be Date
  },
  { timestamps: false }
);


const Customer = models.Customer || model("Customer", customerSchema);
export default Customer;

export const CustomerBackup =
  mongoose.models.CustomerBackup ||
  mongoose.model("CustomerBackup", customerSchema, "customers_backup");
