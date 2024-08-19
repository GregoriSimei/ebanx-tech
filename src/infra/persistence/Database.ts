let autoId = 0

export class DataBase {
    private static dataBase: DataBase
    private data: Map<string, Map<string, any>>

    private constructor() {
        this.data = new Map()
    }

    public static init(table: string) {
        if(!DataBase.dataBase) {
            DataBase.dataBase = new DataBase()
        }

        if(!DataBase.dataBase.data.get(table)) {
            const emptyTable = new Map<string, any>()
            DataBase.dataBase.data.set(table, emptyTable)
        }

        return DataBase.dataBase
    }

    public getTable(table: string): Map<string, any> {
        const found = this.data.get(table)
        if(!found) throw Error('Table not exist')

        return found
    }

    public getData(table: string, id: string): any {
        const foundTable = this.data.has(table)
        if(!foundTable) throw Error('Table not exist')

        const foundData = this.data.get(table)?.get(id)
        if(!foundData) throw Error('Data not exist')
        
        return foundData
    }

    public createData(table: string, data: any): any {
        autoId++
        const newId = autoId.toString()

        const newData = (new Map<string, any>()).set(newId, data)

        this.data.set(table, newData)

        return this.getData(table, newId)
    }

    public saveData(table: string, id: string, data: any): any {
        const foundTable = this.data.has(table)
        if(!foundTable) throw Error('Table not exist')

        const foundData = this.data.get(table)?.get(id)
        if(!foundData) throw Error('Data not exist')
        
        const updatedData = this.data.get(table)?.set(id, data)

        return updatedData
    }
}