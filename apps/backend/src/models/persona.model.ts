import mongoose from "mongoose";

const personaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    systemPrompt: {
      type: String,
      required: true,
      trim: true,
    },
    tone: {
      type: String,
      enum: [
        "formal",
        "casual",
        "flirty",
        "mysterious",
        "aggressive",
        "nurturing",
      ],
      default: "casual",
    },
    personality: {
      traits: [String],
      quirks: [String],
      backstory: String,
      exampleDialogue: [{ user: String, persona: String }], // Few shots of example dialogue
    },
    avatar: String,
    bannerImage: String,
    createdBy: String,
    isPublic: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    totalChats: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

personaSchema.index({ name: "text", tags: 1 });

const Persona = mongoose.model("Persona", personaSchema);

export default Persona;
