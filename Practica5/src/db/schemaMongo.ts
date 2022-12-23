import { ObjectId } from "mongo";
import { usuario } from "../types.ts";

export type userSchema = Omit<usuario, "id"> & {
    _id: ObjectId;
}