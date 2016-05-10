var fs = require('fs');
var _ = require('lodash');

var main = function() {
  'use strict'
  let file = fs.readFileSync('manu.txt', 'utf8');
  let template = fs.readFileSync('templ.html', 'utf8');
  let templLines = template.split('\n');
  let lines = file.split('\n');
  let pages = [];
  let index = -1;
  let header = false;

  let lineFn = function(line) {
    if(line.length > 0) {
      return "<p>" + line + "</p>";
    }
    else {
      return line;
    }
  };

  _.each(lines, function(x) { 
    if(x.startsWith('------------') && !header) {
      header = true;
      pages.push({});
      index++;
      pages[index].lines = '';
    } else if(x.startsWith('------------') && header) {
      header = false;
    } else if(header) {
      pages[index].header = x.trim();
    } else {
      if (x.charCodeAt(x.length - 1) == 13) {
        x = x.substring(0, x.length - 1);
      }
      pages[index].lines += lineFn(x);
    }
  });

  // _.each(pages, function(page) {
  //   var ext = ".txt";
  //   var file = page.header + ext;
  //   console.log("File: " + file);
  //   fs.writeFileSync(file, page.lines, 'utf8');
  // });

  let count = 1,
    countp1;

  if(process.argv.length > 2) {
    count = process.argv[2];
    countp1 = parseInt(count, 10) + 1;cd
  }

  _.each(pages, function(page) {
    var ext = ".html";
    var file = ".\\out\\" + count + ext;
    var templContent = "";
    console.log("lines: " + page.lines);
    _.each(templLines, function(line) {
      if(line.indexOf("**title**") > -1) {
        let ix = line.indexOf("**title**");
        line = line.replace("**title**", page.header)
        console.log(line);
      }
      if(line.indexOf("**text**") > -1) {
        let ix = line.indexOf("**text**");
        line = line.replace("**text**", page.lines)
        console.log(line);
      }
      if(line.indexOf("**prev**") > -1) {
        let ix = line.indexOf("**prev**");
        line = line.replace("**prev**", count - 1)
        console.log(line);
      } 
      if(line.indexOf("**next**") > -1) {
        let ix = line.indexOf("**next**");
        line = line.replace("**next**", countp1);
        console.log(line);
      }            
      templContent += line.trim();
    });
    count++;
    countp1 = parseInt(count, 10) + 1;
    fs.writeFileSync(file, templContent, 'utf8');
  });
};

main();