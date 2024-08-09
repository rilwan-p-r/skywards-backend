import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { RefrehToken } from "../schema/refreshToken.schema";

@Injectable()
export class AdminAuthRepository {
    constructor(@InjectModel(RefrehToken.name) private refrehTokenModel: Model<RefrehToken>,) { }

    async storeRefreshToken(token: string, adminEmail: string) {
        console.log('adminAuthrepooooo', adminEmail);
        const email = adminEmail
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 3);
        await this.refrehTokenModel.updateOne(
            {  email },
            { $set: { expiryDate, token } },
            { upsert: true })
    }

    async findOne(refreshToken: string) {
        return this.refrehTokenModel.findOne({
            token: refreshToken,
            expiryDate: { $gte: new Date() }
        });
    }

}