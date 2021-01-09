const fs = require("fs");
const dir = './uploads';

 fs.readdir(dir, (err, files) => {
  console.log((files).length);
  const countFiles = files.length;
  fs.writeFileSync("notes.json", countFiles );
  });



  

