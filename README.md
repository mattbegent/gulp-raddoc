# Rad Doc

A CSS documentation tool.

## Installation

    npm install gulp-raddoc --save-dev

## Usage

Rad Doc generates a HTML page based on CSS comments at the top of your CSS/Less/SASS files.

Comments must be at the top of the component file and begin with ``/*`` and end with ``*/``. The comments themselves should follow a markdown format. For example:

    /*

    # Alert

    An alert to display information to users
        
    ### Modifiers

    - .Alert--info - used for information alerts 
    - .Alert--success - used for success alerts 
    - .Alert--error - used for error alerts  
                 
    ### Example

        <div class="Alert Alert--info">This is an info alert</div>    
        <div class="Alert Alert--success">This is a success alert</div> 
        <div class="Alert Alert--error">This is an error alert</div>      
         
    */

Here is an example gulp task.   

    gulp.task('raddoc', function () {
        return gulp.src('css/components/**/*') // point this at the files that you want to document
            .pipe(raddoc({
                css: '../assets/css/main.css', // your styles
                outputFolder: '_build/' // where you want rad doc to live
            }))
    });