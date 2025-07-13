const fs = require('fs');
const path = require('path');

export const getAllfile = (folderPath:string)=>{
    let response :string[] = [];
    const allFilesAndFolder = fs.readdirSync(folderPath);
    allFilesAndFolder.forEach((fileOrFolder:string)=>{
        const fullPath = path.join(folderPath, fileOrFolder);
        if(fs.statSync(fullPath).isDirectory()){
            response = response.concat(getAllfile(fullPath));
        }
        else{
            response.push(fullPath);
        }
        
    }
)
    return response;
}