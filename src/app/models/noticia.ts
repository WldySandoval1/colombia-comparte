import { Schema, model } from 'mongoose';

const NoticiaSchema = new Schema({
  titulo: String,
  resumen: String,
  contenido: String,
  autor: String,
  imagen_url: String,
  pais: { type: Schema.Types.ObjectId, ref: 'Pais' },
  estado: { type: String, enum: ['borrador', 'publicado'], default: 'borrador' },
  fecha_creacion: { type: Date, default: Date.now },
});

export const NoticiaModel = model('Noticia', NoticiaSchema);