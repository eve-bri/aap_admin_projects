import { IInvoice } from "./Invoice"

export interface ITask{
    Id?: string
    Archived: boolean
    CreationDate: Date
    FinishDate: Date
    Name: string
    ProjectId: string
    Invoices?: (IInvoice)[]
}