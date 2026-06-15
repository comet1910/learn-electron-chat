import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import 'dotenv/config'
import OpenAI from 'openai';
// import fs from 'fs/promises'
import fs from 'fs'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = async  () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();


  const client = new OpenAI({
    apiKey: process.env['MODEL_API_KEY'],
    baseURL: process.env['MODEL_BASE_URL'],
  })

  const fileObj = await client.files.create({file: fs.createReadStream('img/2410.10315v2.pdf') , purpose:'file-extract' as any})
  console.log(fileObj)

  const resp = await client.chat.completions.create({
    messages:[
      {role:"system" , content: "你是一名人工智能助手"},
      {role:"system" , content: `fileid://${fileObj.id}`},
      {role:"user" , content:"概括这篇论文做了什么工作"},
    ],

    model:'qwen-long'
  })
  

    //识图测试
  // const imageBuffer = await fs.readFile('img/dijia.jpg')
  // const base64Image = imageBuffer.toString('base64')
  // console.log('base64',base64Image)

  // const resp = await client.chat.completions.create({
  //   messages:[{
  //     role:'user',
  //     content:[
  //       {type: 'text',text:'图片中的内容是什么？'},
  //       {type:'image_url', image_url:{url:`data:image/jpeg;base64, ${base64Image}`}}
  //     ]
  //   }],
  //   model : 'qwen3.7-plus'
  // })

  //对话测试
  // const client = new OpenAI({
  //   apiKey: process.env['MODEL_API_KEY'],
  //   baseURL: process.env['MODEL_BASE_URL'],
  // })
  // const resp = await client.chat.completions.create({
  //   messages: [
  //     {role: 'system' , content:'你是一名文学大师，用有文采的语言与我对话'},
  //     {role: 'user' , content:'君子豹变的意思是什么'},

  //   ],
  //   model: 'qwen3-max',
  // })

    console.log('resp',resp.choices[0])

};



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
