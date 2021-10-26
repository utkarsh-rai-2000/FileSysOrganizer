#!/usr/bin/env node

let inputArr = process.argv.slice(2);
let fs = require("fs");
let path = require("path");
let command = inputArr[0];
let directorypath = inputArr[1];
let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex', 'html'],
    app: ['exe', 'dmg', 'pkg', "deb", 'log']
}

switch (command) {
    case "tree":
        treeFun(directorypath);
        break;
    case "organize":
        organizeFun(directorypath);
        break;
    case "help":
        helpFun(directorypath);
        break;
    default:
        console.log("🙏 Please enter a valid command");
        break;
}

function treeFun(directorypath) {

    if (directorypath == undefined) {
        console.log("Kindly enter the path");
        return;
    }
    else {
        let doesExist = fs.existsSync(directorypath);
        if (doesExist) {
            treeHelper(directorypath,"");
        }
        else {
            console.log("Kindly enter valid path");
            return;
        }
    }
}

function treeHelper(directorypath, indent){
    // is file or folder
    let isFile = fs.lstatSync(directorypath).isFile();
    if(isFile == true){
        let fileName = path.basename(directorypath);
        console.log(indent + "├──" + fileName);
    }
    else{
        let dirName = path.basename(directorypath);
        console.log(indent + "└──" + dirName);
        let childrens = fs.readdirSync(directorypath);
        for(let i=0 ; i<childrens.length;i++)
        {
            let childpath = path.join(directorypath, childrens[i]);
            treeHelper(childpath,indent+"\t");
        }
    }
}

//Organize file of a directory in specific order depending on the file type
function organizeFun(directorypath) {

    //1.input->directory path given.

    let destPath;
    if (directorypath == undefined) {
        console.log("Kindly enter the path");
        return;
    }
    else {
        let doesExist = fs.existsSync(directorypath);
        if (doesExist) {

            //2.create->organize file directory.

            destPath = path.join(directorypath, "organized_files");
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }
        }
        else {
            console.log("Kindly enter valid path");
            return;
        }
    }

    organizeHelper(directorypath, destPath);
}

function organizeHelper(src, dest) {
    //3.identify categories of all files present in the input directory.

    let childnames = fs.readdirSync(src);
    for (let i = 0; i < childnames.length; i++) {
        let childAddress = path.join(src, childnames[i]);
        let isfile = fs.lstatSync(childAddress).isFile();
        if (isfile) {
            let category = getCategory(childAddress);
            
            //4.copy/cut files in the organized file directory.

            sendFiles(childAddress, dest, category);
        }
    }
}

function sendFiles(srcFilePath, dest, category)
{
    let categorypath = path.join(dest, category);
    if(fs.existsSync(categorypath)==false){
        fs.mkdirSync(categorypath);
    }
    let filename = path.basename(srcFilePath);
    let destFilePath = path.join(categorypath,filename);
    fs.copyFileSync(srcFilePath,destFilePath);
    console.log(filename," copied to ", category);
}

function getCategory(name) {
    let ext = path.extname(name).slice(1);
    for (let type in types) {
        let ctypearr = types[type];
        for (let i = 0 ; i < ctypearr.length ; i++)
        {
            if (ext == ctypearr[i]) {
                return type;
            }
        }
    }
    return "others";
}
//List of commands that are available
function helpFun(directorypath) {
    console.log(`
                List of all commands:
                node main.js tree "directorypath"
                node main.js organize "directorypath"
                node main.js help
                `);
}
