# webflow-angularJS
[grunt-webflow-angularJS]
 
A [grunt-init] template for integrating [webflow.com] into an angularJS app .

## Description
 This sample webflow-angular integration mimicks the demo angular app created around this [CustomerManager Sample App] by [Dan Wahlin]. Rather than relying on the partial files of that demo, this project will extract them out from your downloaded webflow.zip file.  It expects that you follow the class and id conventions defined at the bottom.

[grunt-webflow-angularJS]: https://github.com/JimW/grunt-template-webflow-angularJS.git
[grunt-init]: http://gruntjs.com/project-scaffolding
[webflow.com]: https://webflow.com
[CustomerManager Sample App]: https://github.com/DanWahlin/CustomerManager
[Dan Wahlin]:http://weblogs.asp.net/dwahlin/video-tutorial-angularjs-fundamentals-in-60-ish-minutes
[Sample Webflow Preview]:https://webflow.com/design/angularjsdemos?preview=4827e2759f4c685919101def23ae3ca6

## Installation

If you haven't already done so:  

* install [grunt-init][].

Once grunt-init is installed, 

* place this template in your `~/.grunt-init/` directory.  
It's recommended that you use git to clone this template into that directory, as follows:  
```
git clone https://github.com/JimW/grunt-template-webflow-angularJS.git ~/.grunt-init/webflow-angularJS
```

_(Windows users, see [the documentation][grunt-init] for the correct destination directory path)_

## Usage

#### Step 1:

At the command-line, cd into an empty directory, run these commands:  

```
grunt-init webflow-angularJS
```

_Note that this template will generate files in the current directory, so be sure to change to a new directory first if you don't want to overwrite existing files._

#### Step 2:

```
npm install
```  
to install all the node modules specified in the newly created package.json

#### Step 3:
```
grunt webflow
```
will unzip and parse any angular partials from the sample_download direcory.  It will start a local webserver and serve up the project:  

browse to:
```
http://localhost:9009  
```

#### Step 4:
Once everything seems to be working with the local predefined sample zip file, use your own webflow export and see how it goes.
Download yourappname.webflow.zip from [webflow.com] into your downloadZipDir.

Update ```_grunt_configs/webflow.json```

```
{
  "appName": "angularjsdemos",  
  "downloadZipDir": "/Users/jim/Downloads"  
}
```

##Webflow.com Instructions:

Look at the sample webflow site included within the sample_download folder, to see an example of how the DOM elements can be structured for extraction by the tasks defined within the gruntfile associated with this template. Here is a [Sample Webflow Preview] version, but at some point, I'll need my 20th paid slot for other sites.

### Special Classes to be Used within Webflow:

####mockmeUp 
Specifies elements that should be discarded during import into the Angular App.

####directive 
Because Webflow does not currently allow for the specification of directives, the gruntfile will do it for you.  If an element has a class of 'directive', after processing it's children, all child elements will be removed and the element type will be replaced by the specified directive name, as defined within it's ID.  The way the webflow portion of the example works, is that a webflow slider beneath a 'directive' element, uses a 'template' class on each slide.  This might allows for a more design accurate representation of the overall page, assuming that each slide will ultimately be a partial filling the same hole.

####template
Specifies a hierarchy of elements whose children will all be saved into a seperate partial html file, to be used by angular.  The name of this partial html file is specied by it's id.

## Current Transformations Made to Webflow code:

 * data-wf-site attrubute is removed

## TODOs

1. Make the watch work for the download directory so that once a new download appears, the site is automatically updated.  grunt-watch currently won't pickup on a new file being added to an empty folder for some reason.  

2. Do other TODOs scattered throughout the gruntfile, form submission is not working totally

3. No idea if this works on a PC

