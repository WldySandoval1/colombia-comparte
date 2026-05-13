import { Schema, model } from "mongoose";

const TestimonioSchema = new Schema({
  nombre: String,
  foto_url: String,
  testimonio: String,
  pais: {
    type: String,
    enum: ["Chile", "Colombia", "Ecuador"],
    required: true,
  },
  instagram_url: String,
  facebook_url: String,
  estado: {
    type: String,
    enum: ["borrador", "publicado", "despublicado"],
    default: "borrador",
  },
  fecha_creacion: { type: Date, default: Date.now },
});

export const TestimonioModel = model("Testimonio", TestimonioSchema);
