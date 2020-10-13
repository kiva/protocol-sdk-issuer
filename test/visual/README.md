# kiva_visual_regression_project
Known as PRO-2249, this project's purpose is to write a script in Backstop that can compare two images for differences then make it extensible so that it can compare multiple image-pairs in a loop.
Lastly the screenshot diff engine should allow a human to visually inspect the two images compared for verification. 
These tests were  inspired from the Udemy course, "Visual Regression Testing with BackstopJS" by Walmyr Lima e Silva Filho and worked on previously from another project (check out Tiara S. Coleman's github page).

Additionally, this project performs 8 scenarios in which all will pass. 

In order to run the program, in the terminal window type: 
"npm test" which will create the reference images (make sure all of the images are displayed) then type in the window:
"npm run visual:approve" thus this will compare the two images (the reference image and the screenshot)
