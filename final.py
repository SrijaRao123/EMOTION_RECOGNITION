import numpy as np
import tensorflow as tf
import cv2
from keras.preprocessing.image import load_img
import face_recognition
import base64
from flask import Flask, request, jsonify
from datetime import datetime
from flask_cors import CORS
import matplotlib.pyplot as plt

app = Flask(__name__)

# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# CORS(app, origins="http://localhost:3000")
CORS(app)

# Define the emotion classes
Classes = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"]

# Load the emotion detection model
model_filename = 'emotiondetector.h5'
loaded_model = tf.keras.models.load_model(model_filename)
print("Model loaded successfully.")

def detect_and_crop_face(image):
    # Detect face(s) in the image
    face_locations = face_recognition.face_locations(image)
    if face_locations:
        # Use the first detected face
        top, right, bottom, left = face_locations[0]
        face_img = image[top:bottom, left:right]
        return face_img
    else:
        return None

def preprocess_image(image, img_size=48):
    # Resize and normalize the face image for emotion detection model
    img = cv2.resize(image, (img_size, img_size))
    img = cv2.equalizeHist(img)  # Improve contrast for better feature extraction
    img = img / 255.0
    img = img.reshape(1, img_size, img_size, 1)
    return img

def predict_emotion(image, model):
    # Predict emotion from the preprocessed image
    processed_image = preprocess_image(image)
    predictions = model.predict(processed_image)
    predicted_class = np.argmax(predictions, axis=1)[0]
    confidence = np.max(predictions)
    return Classes[predicted_class], float(confidence)  # Convert to float for JSON serialization

@app.route('/recognize_emotion', methods=['POST'])
def recognize_emotion():
    try:
        # print(request.json)
        data = request.json  # Parse JSON data from request
        image_data = base64.b64decode(data['image'])
        np_img = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        # Convert to grayscale for emotion detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Detect and crop the face
        face_img = detect_and_crop_face(gray)

        if face_img is not None:
            # Predict emotion from the cropped face
            emotion, confidence = predict_emotion(face_img, loaded_model)
            print(emotion)
            return jsonify({
                'predicted_emotion': emotion,
                'confidence': confidence,  # Include confidence in the response
                'status': 'Emotion detected successfully'
            })
        else:
            return jsonify({'status': 'No face recognized'}), 400
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'status': 'Server error', 'error': str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)
