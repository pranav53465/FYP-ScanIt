STEPS TO RUN

1. Unzip the Python app folder.
2. Change directory to the project folder
3. Download and install python3.7
4. Setup a virtual environment with virtualenv, run "virtualenv <your virtualenv name here*>"(after installing python3.7 and pip3, you can "run pip3 install virtualenv")
5. Run "python3 setup.py install" to install dependencies.
6. After dependencies have been installed, Run "python3 api_for_FYP.py" to start the API.
7. Flask API endpoint is 127.0.0.1 with port 5000 by default, which is already set in the Node JS side. 

------------------------------------------------------------------------------------------------------------------------

8. Install Node, NPM, MongoDB, 
9. Unzip the WebApp folder
10. Open CMD/Powershell/Terminal in project directory
11. Execute "npm install"
12. Once done, open a seperate CMD/Powershell/Terminal and set up MongoDB database
13. Set up free Cloundinary account at https://cloudinary.com/ and FILL IN the needed credentials as listed to the ".env" file of the main project folder. Without this step the app will not work.
14. Once everything is set up and installed, run "node app.js", or "nodemon app.js"
15. ScanIt will be available at "localhost:3000"
16. You can get started by creating an account at the Register page.


Note: This version of the code contains partially completed aspects of a REVIEWS attribute. This is a work in progress to allow users to provide feedback, however they are not functional yet. Regardless, they do not affect or hamper the other functionality or performance of the app.
Important Information:
ScanIt only accepts files in "jpeg", "png" and "jpg" formats now. An image of another format will not get passed to the MathReader API and hence will not get parsed.

Do contact if further assistance is needed
 