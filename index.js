const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const fs = require("fs/promises");
const fsSome = require("fs");
const routes = require("./routes/routes");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 2500;
const START_PATH = "./dirTree";
let store = [];

const createObject = (queryId, index, item, parentId) => {
  return {
    id: queryId * 10 + index + 1,
    title: item,
    children: [],
    parentId,
  };
};

function getFolder(id, array) {
  if (array && array.length > 0) {
    const object = array.find((item) => {
      return item.id == id;
    });
    if (object) {
      return object;
    }

    for (let i = 0; i < array.length; i++) {
      const currentFolder = getFolder(id, array[i].children);
      if (currentFolder) return currentFolder;
    }

    return;
  }

  return;
}

const getFolderPath = (folder) => {
  if (folder.parentId === null) {
    return "";
  }

  return getFolderPath(getFolder(folder.parentId, store)) + "/" + folder.title;
};

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(routes);

app.get("/", async function (req, res) {
  try {
    const queryId = req.query.dirId || 1;
    if (!req.query.dirId) {
      store.push(createObject(0, 0, "root", null));
    }
    const folder = getFolder(queryId, store);
    const rightname = getFolderPath(folder);
    let allPath = req.query.dirId ? START_PATH + "/" + rightname : START_PATH;

    const dirInfo = (await fsSome.lstatSync(allPath).isFile())
      ? await fs.readFile(allPath)
      : await fs.readdir(allPath);

    const dirInfoNew = dirInfo.map((item, index) => {
      return createObject(queryId, index, item, folder.id);
    });

    folder.children = dirInfoNew;
    if (await fsSome.lstatSync(allPath).isFile()) {
      return res.download(dirInfo);
    }
    res.send(folder);
  } catch (err) {
    console.error(err);
    res.sendStatus(404);
  }
});

async function startServ() {
  try {
    // await mongoose.connect(
    //   "mongodb+srv://main:PASSWORD@cluster0.xgas6.mongodb.net/node-auth",
    //   {
    //     useNewUrlParser: true,
    //     useFindAndModify: false,
    //     useUnifiedTopology: true,
    //   }
    // );
    app.listen(PORT, () => {
      console.log("Server started...on port: ", PORT);
    });
  } catch (err) {
    console.error(err);
  }
}

startServ();
