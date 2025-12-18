// import mongoose from "mongoose";

// const projectSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true
//     },
//     description: {
//       type: String,
//       required: true
//     },
//     requiredSkills: [String],
//     points: {
//       type: Number,
//       required: true
//         },
//     assignedTo: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "User",
//   default: null
//         },
    
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     status: {
//       type: String,
//       enum: ["open", "in-progress", "completed"],
//       default: "open"
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Project", projectSchema);


import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: [String],
    points: { type: Number, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "awaiting-verification","completed"],
      default: "open"
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    workerCompleted: {
      type: Boolean,
      default: false
    },
    clientVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
