def analyze_symptoms(symptoms):

    symptoms = symptoms.lower()

    if "chest pain" in symptoms or "heart pain" in symptoms:
        return {
            "status": "Emergency",
            "department": "Cardiology / Emergency",
            "message": "Please seek emergency medical care immediately."
        }

    elif "headache" in symptoms or "dizziness" in symptoms or "migraine" in symptoms:
        return {
            "status": "General",
            "department": "Neurology",
            "message": "Neurology may be relevant. Please consult a healthcare professional."
        }

    elif "knee pain" in symptoms or "bone pain" in symptoms or "joint pain" in symptoms:
        return {
            "status": "General",
            "department": "Orthopedics",
            "message": "Orthopedics may be relevant. Please consult a healthcare professional."
        }

    elif "fever" in symptoms or "cold" in symptoms or "cough" in symptoms:
        return {
            "status": "General",
            "department": "General Medicine",
            "message": "General Medicine may be relevant. Please consult a healthcare professional."
        }

    elif "rash" in symptoms or "itching" in symptoms or "skin" in symptoms:
        return {
            "status": "General",
            "department": "Dermatology",
            "message": "Dermatology may be relevant. Please consult a healthcare professional."
        }

    else:
        return {
            "status": "General",
            "department": "General Medicine",
            "message": "Please consult a healthcare professional."
        }