# Rad Doc

A CSS documentation tool.

## Installation

    npm install gulp-raddoc --save-dev

## Usage

Rad Doc generates a HTML based on CSS comments at the top of your CSS/Less/SASS files.

They must be in the following format and use markdown.

    /*

    # Alert

    A style for alerts            
         
        <div class="Alert Alert--info">This is an alert</div>    
        <div class="Alert Alert--success">This is an alert</div> 
        <div class="Alert Alert--error">This is an alert</div>      
         
    */  

Here is an example gulp task.   

    gulp.task('raddoc', function () {
        return gulp.src('css/components/**/*') // point this at the files that you want to document
            .pipe(raddoc({
                css: '../assets/css/main.css', // your styles
                outputFolder: '_build/' // where you want rad doc to live
            }))
    });