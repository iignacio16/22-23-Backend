import {ObjectId} from "mongo"
import { author, books, user } from "../types.ts";

export type userSchema =  user & {_id: ObjectId} 
export type bookSchema = {_id: ObjectId} & books
export type authorSchema = {_id: ObjectId} & author