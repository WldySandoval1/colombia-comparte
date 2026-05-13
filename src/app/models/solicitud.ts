import { Schema, model } from "mongoose";

const SolicitudSchema = new Schema({
  nombre: String,
  correo: String,
  telefono: String,
  finalidad: String,
  pais: {
    type: String,
    enum: ["Chile", "Colombia", "Ecuador"],
    required: true,
  },
  estado: {
    type: String,
    enum: ["pendiente", "gestionada", "respondida"],
    default: "pendiente",
  },
  fecha_creacion: { type: Date, default: Date.now },
});

export const SolicitudModel = model("Solicitud", SolicitudSchema);
