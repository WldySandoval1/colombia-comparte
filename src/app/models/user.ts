import { Schema, model, Document, Types } from "mongoose";
import { IUser } from "../services/interfaces/user";

interface IUserDocument extends IUser, Document { }

export const UserSchema = new Schema<IUserDocument>({
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: function (this: IUserDocument) {
      return this.isNew;
    },
  },
  email: {
    type: String,
    unique: true,
    required: function (this: IUserDocument) {
      return this.isNew;
    },
  },
  phone: {
    type: String,
    required: function (this: IUserDocument) {
      return this.isNew;
    },
  },
  password: {
    type: String,
    required: function (this: IUserDocument) {
      return this.isNew;
    },
  },

  rol: {
    type: String,
    enum: ['superadmin', 'admin_pais', 'editor'],
    required: true,
    default: 'editor',        // valor por defecto al crear un usuario
  },
  pais_asignado: {
    type: Types.ObjectId,
    ref: 'Pais',              // referencia a la colección de países
    default: null,            // null si es superadmin
  },

  CreatedAt: {
    type: Date,
    required: function (this: IUserDocument) {
      return this.isNew;
    },
    default: new Date(),
  },
  UpdatedAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

UserSchema.method('toJSON', function () {
  const { __v, _id, password, ...data } = this.toObject();
  data.uid = _id;
  return data;
});

UserSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.UpdatedAt = new Date();
  }
  next();
});

export const UserModel = model('User', UserSchema);