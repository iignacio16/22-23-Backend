import { ObjectId } from "mongo";
import { Coche, Concesionario, Vendedor } from "../types.ts";

export type cocheSchema = Omit<Coche, "id"> & {_id: ObjectId}
export type vendedorSchema = Omit<Vendedor, "id"> & {_id: ObjectId}
export type concesionarioSchema = Omit<Concesionario, "id"> & {_id: ObjectId}