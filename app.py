from flask import Flask, render_template, request
import pandas as pd
import pickle
from datetime import datetime

app = Flask(__name__)

# Load encoder dan scaler
with open('models/scaler_lr_knn.pkl', 'rb') as f:
    scaler_lr_knn = pickle.load(f)
#with open('scaler_rf.pkl', 'rb') as f:
    #scaler_rf = pickle.load(f)

with open('models/le_gender.pkl', 'rb') as f:
    le_gender = pickle.load(f)
with open('models/le_sleep_duration.pkl', 'rb') as f:
    le_sleep = pickle.load(f)
with open('models/le_dietary_habits.pkl', 'rb') as f:
    le_diet = pickle.load(f)
with open('models/le_suicidal_thoughts.pkl', 'rb') as f:
    le_suicide = pickle.load(f)
with open('models/le_family_history.pkl', 'rb') as f:
    le_family = pickle.load(f)

# Load model-model
with open('models/LR_model.pkl', 'rb') as f:
    model_lr = pickle.load(f)
with open('models/KNN_model.pkl', 'rb') as f:
    model_knn = pickle.load(f)
with open('models/RF_model_1.pkl', 'rb') as f:
    model_rf = pickle.load(f)

def interpret_label(pred):
    return "Tidak Depresi" if pred == 0 else "Depresi"

from datetime import datetime

@app.route("/")
def index():
    return render_template("index.html", results=None, current_year=datetime.now().year)


@app.route('/predict', methods=['POST'])
def predict():
    gender = le_gender.transform([request.form['gender']])[0]
    age = float(request.form['age'])
    academic_pressure = float(request.form['academic_pressure'])
    study_satisfaction = float(request.form['study_satisfaction'])
    sleep = le_sleep.transform([request.form['sleep_duration']])[0]
    diet = le_diet.transform([request.form['dietary_habits']])[0]
    suicidal = le_suicide.transform([request.form['suicidal_thoughts']])[0]
    study_hours = float(request.form['study_hours'])
    financial_stress = float(request.form['financial_stress'])
    family = le_family.transform([request.form['family_history']])[0]

    # Buat DataFrame
    features = pd.DataFrame([[
        gender, age, academic_pressure, study_satisfaction,
        sleep, diet, suicidal, study_hours, financial_stress, family
    ]], columns=[
        'Gender', 'Age', 'Academic Pressure', 'Study Satisfaction',
        'Sleep Duration', 'Dietary Habits', 'Have you ever had suicidal thoughts ?',
        'Study Hours', 'Financial Stress', 'Family History of Mental Illness'
    ])

    # Scaling untuk LR dan KNN
    scaled_input = scaler_lr_knn.transform(features)

    # Prediksi
    pred_lr = model_lr.predict(scaled_input)[0]
    pred_knn = model_knn.predict(scaled_input)[0]
    pred_rf = model_rf.predict(features)[0]

    results = {
        "logistic": {
            "risk": interpret_label(pred_lr),
        },
        "knn": {
            "risk": interpret_label(pred_knn),
        },
        "random_forest": {
            "risk": interpret_label(pred_rf),
        }
    }

    return render_template('index.html', results=results)

if __name__ == '__main__':
    app.run(debug=True)
