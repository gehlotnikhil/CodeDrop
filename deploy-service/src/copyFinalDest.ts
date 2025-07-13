import { getAllfile } from "./getAllFile"
import { uploadFromFilePath } from "./uploadAllFile"
import path from "path"



export async function copyFinalDest(id:string) {
    const folderPath = path.join(__dirname,`output/${id}/dist`)
    const files = await getAllfile(folderPath)
    console.log(files)
    files.map(async file=>{
        await uploadFromFilePath(file,path.join(`dist/${id}`,file.slice(file.lastIndexOf("dist")+5) ))
        
    })


}