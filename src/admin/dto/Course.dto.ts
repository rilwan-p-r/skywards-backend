import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CourseDto{
    @IsString()
    @IsNotEmpty()
    readonly course:string;

    @IsString()
    @IsNotEmpty()
    readonly description:string;

    @IsArray()
    @IsString({each:true})
    @IsNotEmpty({each:true})
    readonly subjects:string[];
}