import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { AdminRefreshToken } from "../schema/adminRefreshToken.schema";

@Injectable()
export class AdminAuthRepository {
    constructor(@InjectModel(AdminRefreshToken.name) private readonly adminRefreshTokenModel: Model<AdminRefreshToken>,) { }

    async storeRefreshToken(token: string, adminEmail: string) {
        console.log('adminAuthrepooooo', adminEmail);
        const email = adminEmail
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 15);
        await this.adminRefreshTokenModel.updateOne(
            {  email },
            { $set: { expiryDate, token } },
            { upsert: true })
    }

    async findOne(refreshToken: string) {
        return this.adminRefreshTokenModel.findOne({
            token: refreshToken,
            expiryDate: { $gte: new Date() }
        });
    }

}