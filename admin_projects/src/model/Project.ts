import { ITask } from "./Task"
import { IUser } from "./User"

export interface IProject{
    Id?:string
    Archived: boolean
    CompanyId: string
    CreationDate: Date
    Description: string
    Name: string
    UserId: string
    Tasks?: (ITask)[]
    User?: IUser
    key: string
}