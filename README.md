**Installation**
1. Clone the repository.
2. Install [Node.js](https://nodejs.org/download/release/v20.11.0/), preferably version **20.11.0** or newer.
3. Install npm dependencies by opening the terminal in the root directory of the cloned repository, and entering the command:

       npm i

**Making Changes**
1. Modify your data and image files.
2. Execute [`build.bat`](build.bat) to build all static files.
3. Commit all changes (changed source files and generated static files) to the repository.

**Changing Events**
1. Modify [`build/events.json`](build/events.json) by adding, changing or deleting events.
2. Save your changes as explained in section **Making Changes**.

**Changing Images**
1. Place the image inside the [`images/`](images/) directory.
   - Accepted image formats are `.webp`, `.png` and `.jpg`.
   - Images are displayed on the page in the same order as placed in the directory. 
2. Save your changes as explained in section **Making Changes**.