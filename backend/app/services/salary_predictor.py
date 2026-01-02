import numpy as np
from sklearn.linear_model import LinearRegression

# 1. Dummy Historical Data (Years of Exp, Salary in Lakhs)
X_train = np.array([[0], [1], [2], [3], [4], [5], [8], [10]]) # Years
y_train = np.array([4.0, 5.5, 7.0, 9.5, 12.0, 15.0, 24.0, 30.0]) # Salary (LPA)

# 2. Train the Model
model = LinearRegression()
model.fit(X_train, y_train)

def predict_salary(years_experience):
    """
    Predicts salary based on years of experience using Linear Regression.
    """
    try:
        # Predict
        prediction = model.predict(np.array([[years_experience]]))
        estimated_lpa = round(prediction[0], 1)
        
        # Add some randomness so it doesn't look robotic
        return f"₹{estimated_lpa} - {estimated_lpa + 2.5} LPA"
    except Exception as e:
        return "₹5.0 - 10.0 LPA"