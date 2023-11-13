# app.py

from flask import Flask, request, render_template, redirect, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import tensorflow as tf
from werkzeug.utils import secure_filename
import numpy as np
from tensorflow import keras
import cv2

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hospital.db'
app.config['SECRET_KEY'] = os.urandom(24)
db = SQLAlchemy(app)

IMAGE_SIZE = (150, 150)
current_directory = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = 'static\\uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
app.config['UPLOAD_FOLDER'] = os.path.join(current_directory, UPLOAD_FOLDER)

# Load the trained model
model = keras.models.load_model('pneumonia_detection_model.h5')

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

def image_preprocessor(path):
    '''
    Function to pre-process the image before feeding to model.
    '''
    print('Processing Image ...')
    currImg_BGR = cv2.imread(path)
    b, g, r = cv2.split(currImg_BGR)
    currImg_RGB = cv2.merge([r, g, b])
    currImg = cv2.resize(currImg_RGB, IMAGE_SIZE)
    currImg = currImg/255.0
    currImg = np.reshape(currImg, (1, 150, 150, 3))
    return currImg

def model_pred(image):
    '''
    Perfroms predictions based on input image
    '''
    print("Image_shape", image.shape)
    print("Image_dimension", image.ndim)
    # Returns Probability:
    # prediction = model.predict(image)[0]
    # Returns class:
    prediction = model.predict(image)[0]
    '''    if prediction == 1:
        return "Pneumonia"
    else:
        return "Normal"'''
    return (prediction)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def signInSignUp():
    return render_template('index.html')

@app.route('/signup', methods=['POST'])
def signup():
    email = request.form['email']
    username = request.form['username']
    password = request.form['password']
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(email=email, username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    user = User.query.filter_by(username=username).first()
    session['user_id'] = user.id
    session['username'] = user.username
    return redirect(url_for('home'))

@app.route('/signin', methods=['POST'])
def signin():
    username = request.form['username']
    password = request.form['password']
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        session['user_id'] = user.id
        session['username'] = user.username
        return redirect(url_for('home'))
    return 'Login failed. Check your credentials.'

@app.route('/home')
def home():
    if 'username' in session:
        return render_template('user_page.html')
    return 'Home page - You need to be logged in to access this page.'

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('signInSignUp'))

@app.route('/uploadImage', methods=['POST'])
def uploadImage():
    if 'image' in request.files:
        uploaded_image = request.files['image']
        if uploaded_image and allowed_file(uploaded_image.filename):
            # Process the uploaded image and make a prediction
            filename = secure_filename(uploaded_image.filename)
            imgPath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            uploaded_image.save(imgPath)
            print(f"Image saved at {imgPath}")
            # Preprocessing Image
            image = image_preprocessor(imgPath)
            # Perfroming Prediction
            prediction = model_pred(image)
            print(prediction)
            
            if prediction >= 0.95:
                return jsonify({"result": "Pneumonia Detected"})
            else:
                return jsonify({"result": "No Pneumonia Detected"})
        else:
            return redirect(url_for('error'))
    else:
        return redirect(url_for('error'))




@app.route('/error')
def error():
    return "<h2>Something Went Wrong</h2>"

if __name__ == '__main__':
    app.run(debug=True)
