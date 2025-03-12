## HAND-WRITTEN-RECOGNITION-IN-REAL-TIME-WITH-Tkinter-GUI,TFJS

1 . The file "1-HandWriiten digits localization GUI- github.ipynb" contains the code to train a CNN model using Mnist dataset.

2 . The model predicts the class/label of the digit after classifying it, along with the bounding box coordinates.

3 . Now this fully trained model can be tested using a Tkinter Canvas in realtime (Sample images uploaded). 

4 . The model is saved in '.h5' file format, and is also converted to json format using tesorflow.js, which laater is used to deploy in the web

5 . The folder "2-Deployment using TFJS" has the models.json along with the bin files, and the html file is where our model is represented using tensorflow.js(sample images uploaded) .

6. Test the model by opening the canvas.html file.

*Important Note : To make the model.json work in the webapp using tensorflow.js , it should run on a webserver , the approach i used is by running "web server for chrome" from a chrome extenstion.
