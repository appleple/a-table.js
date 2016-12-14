#! /usr/bin/env node
var fs = require("fs");
var process_path = process.cwd();
var path = require('path');
var text = fs.readFileSync(path.resolve(process_path, "./src/index.js"), 'utf8');
text = text.replace(/import (.*?) from '((.*?)\.(html|css))'/g,function(a,b,c){
	return "var "+ b +" = \`"+fs.readFileSync(path.resolve(process_path,"./src/",c), 'utf8')+"\`";
});
fs.writeFileSync(path.resolve(process_path,"./prebuild.js"),text, 'utf8');
