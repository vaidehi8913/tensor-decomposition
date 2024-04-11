## Contributing to the code

This project is written in `react`.  Once you have the git repo cloned, you can contribute to 
the code by following these steps.

### Install the node project manager

**If you have never worked with react before**, make sure that you have the node project 
manager installed.  You can find it here.

    https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

### Install dependencies

This project uses a few other packages that you need to install.  Luckily, the node
project manager is here to help you with exactly that.  **If this is your first time** 
**running the project (or you just pulled updates that changed the dependencies)**, run

    npm install

from the top level directory.

### Run the project locally

When editing the project, it is useful to run it locally.  To run the project
locally, run 

    npm start

from the top level directory.  This should automatically pop up a version 
running locally.  If you aren't seeing it, trying going to 

    localhost:3000/tensor-decomposition

in your browser.

### Edit the code

The functionality of the visualizer is all in files in the `src` directory.  
The function `calculateGradient()` in the file `TensorDecomposition.js` is 
a good place to start.  Make sure you are editing the `master` branch.

Files in the `public` directory, along with a few files in the `src` directory
(`index.js`, `index.css`, `Main.js`) are there to host the site and do other
logistical tasks that you probably don't want to mess with.

Every time you save a file, it should automatically instantly update the locally
running version (if you have `npm start` running).

### Push your changes

If you are updating the code, make sure to commit and push your changes to 
git. Then...

### Deploy changes to the site

To make sure that your changes will actually show up on the published version
of the site, you should run 

    npm run deploy

from the top level directory.  The changes may take 5-6 minutes to refresh.
(This will get `npm` to build the project, and commit the new version to 
the `gh-pages` branch, where github pages with load it from.  Don't try to 
mess with the `gh-pages` branch directly, you may upset the balance of the
universe.)
