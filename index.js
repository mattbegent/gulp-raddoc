var through = require('through2');
var fs = require('fs-extra');
var marked = require('marked');
var ejs = require('ejs');
var gutil = require('gulp-util');
var path = require('path');
var _ = require('lodash');
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-raddoc';

var comments = '';

module.exports = function(options) {

    options = _.extend({
        css: '../components/userstyle.css',
        outputFolder: './',
        docHomeTemplate: 'index.ejs',
        docHomeOutput: 'index.html',
        docTitle: 'Rad Doc'
    }, options || {});

    comments = ''; // clear
    
    return through.obj(function (file, enc, cb) {

        if (file.isNull()) {
          cb(null, file);
        }

        if (['.css', '.less', '.scss'].indexOf(path.extname(file.path)) === -1) {
            this.emit('error', new PluginError(PLUGIN_NAME,'CSS only currently'));
            cb(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported'));
            cb(null, file);
        }

        if (file.isBuffer()) {
            getComments(file.contents, options);
        }

        cb(null, file);

    }, function (cb) {

        renderTemplate(comments, options);

        cb();

    });

};

function getComments(contents, options) {

    var currentContent = String(contents);

    if(currentContent.indexOf("*/") > -1) {

        var currentComment = currentContent.split('*/')[0].replace('/*', '');

        // turn into markdown
        currentComment = marked(currentComment);

        // get html example
        currentComment = "<div class='radDoc-Section'>" + currentComment + "</div>";
        var getHTML = unescapeHTML(currentComment.substring(currentComment.lastIndexOf("<pre><code>")+11,currentComment.lastIndexOf("</code></pre>")));
        currentComment = insertBeforeLastOccurrence(currentComment, '<pre>', getHTML);

        comments += currentComment;
        
    }

}

function unescapeHTML(escapedHTML) {
    return escapedHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&quot;/g,'"');
}

function insertBeforeLastOccurrence(strToSearch, strToFind, strToInsert) {
    var n = strToSearch.lastIndexOf(strToFind);
    if (n < 0) return strToSearch;
    return strToSearch.substring(0,n) + strToInsert + strToSearch.substring(n);    
}

function renderTemplate(comments,options) {

    var templateData = {
        component: comments,
        userstyles: options.css,
        docTitle: options.docTitle
    };
  
     fs.readFile(path.resolve(__dirname, options.docHomeTemplate), 'utf8', function (err, data) {
        if (err) throw new PluginError(PLUGIN_NAME, err);
        var template = ejs.render(data, templateData);
        fs.writeFile(path.resolve(__dirname, options.docHomeOutput), template, function (err) {
            if (err) throw new PluginError(PLUGIN_NAME, err);

            // copy file to output directory
            fs.copy(path.resolve(__dirname, options.docHomeOutput), options.outputFolder + 'raddoc.html', function (err) {
                if (err) throw new PluginError(PLUGIN_NAME, err);
            });
        }); 
    });
 
}