#! /usr/bin/env node
var fs = require("fs");
var process_path = process.cwd();
var path = require('path');
var text = fs.readFileSync(path.resolve(process_path, "./src/index.js"), 'utf8');
text = text.replace(/require\('((.*?)\.(html|css))'\)/g,function(a,b){
	return "\`"+fs.readFileSync(path.resolve(process_path,"./src/",b), 'utf8')+"\`";
});
text = text.replace(/require\('\.\/(.*?)\.js'\)/g,"require('./src/$1.js')");
fs.writeFileSync(path.resolve(process_path,"./prebuild.js"),text, 'utf8');
