import { Schema, model, type InferSchemaType } from "mongoose";

const taskSchema = new Schema(
  {
    task: { type: String, required: true, trim: true, minlength: 3 },
    description: { type: String, default: "" },
    time: { type: String, default: "" },
    done: { type: Boolean, default: false },
    order: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = (ret._id as { toString(): string }).toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export type TaskDocument = InferSchemaType<typeof taskSchema>;

export default model("Task", taskSchema);
