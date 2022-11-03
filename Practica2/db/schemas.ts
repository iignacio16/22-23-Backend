import {ObjectId} from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import {transaction, User} from "../types.ts"

export type userSchema = Omit<User, "ID"> & {_id : ObjectId}

export type transactionSchema = transaction & {_id : ObjectId}