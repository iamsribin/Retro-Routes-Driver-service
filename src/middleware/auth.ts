import jwt, { SignOptions } from "jsonwebtoken";
import { ObjectId } from "mongoose";

export default {
  createToken: async (clientId: ObjectId, expire: string, role: string) => {
    const jwtSecretKey = process.env.JWT_SECRET ?? "Sribin";
    const token = jwt.sign({ clientId,role }, jwtSecretKey, {
      expiresIn: expire as SignOptions["expiresIn"],
    });

    return token;
  },
};
