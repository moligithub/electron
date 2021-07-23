import path from 'path'
const edge = require('electron-edge-js')

// export default class WordEdit{
//     constructor(){
//         if (process.env.NODE_ENV !== 'development') {
//             global.__lib = require('path').join(__dirname, '/lib/office-edit').replace(/\\/g, '\\\\')
//         }
//     }
//     static wordDelNoteFootCallback = edge.func({
//         assemblyFile: path.join(__lib, 'ClassLibraryMSOfficeEdit.dll'),
//         typeName: 'ClassLibraryMSOfficeEdit.ClassEditWord',
//         methodName: 'WordDelNoteFootCallback'
//     })
//
//     static wordDelSubSuperScriptCallback = edge.func({
//         assemblyFile: path.join(__lib, 'ClassLibraryMSOfficeEdit.dll'),
//         typeName: 'ClassLibraryMSOfficeEdit.ClassEditWord',
//         methodName: 'WordDelSubSuperScriptCallback'
//     })
//
//
//     static wordDelNoteFoot (filePathInput='', filePathOutput='') {
//         let file = {input: '', output: ''}
//         file.input = filePathInput;
//         file.output = filePathOutput;
//         this.wordDelNoteFootCallback(file, function (error, result){
//             if (error) throw error
//             console.log(result)
//         });
//     }
//
//     static wordDelSubSuperScript(filePathInput='', filePathOutput='') {
//         let file = {input: '', output: ''}
//         file.input = filePathInput;
//         file.output = filePathOutput;
//         this.wordDelNoteFootCallback(file, function (error, result){
//             if (error) throw error
//             console.log(result)
//         });
//     }
// }
