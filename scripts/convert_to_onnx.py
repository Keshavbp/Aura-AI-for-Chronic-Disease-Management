import joblib
import os
import numpy as np
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base_dir, "models", "aura_rf_model.pkl")
    scaler_path = os.path.join(base_dir, "models", "aura_scaler.pkl")
    onnx_path = os.path.join(base_dir, "models", "aura_model.onnx")
    onnx_scaler_path = os.path.join(base_dir, "models", "aura_scaler.onnx")

    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        print(f"Could not find .pkl models at {model_path} or {scaler_path}")
        return

    print("Loading existing .pkl models (This is the last time!)...")
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)

    # 1. Convert the Model
    print("Converting Random Forest Model to ONNX...")
    # The model takes 21 features as float32
    initial_type = [('float_input', FloatTensorType([None, 21]))]
    onx_model = convert_sklearn(model, initial_types=initial_type)
    
    with open(onnx_path, "wb") as f:
        f.write(onx_model.SerializeToString())
    print(f"Successfully saved {onnx_path}")

    # 2. Convert the Scaler
    print("Converting StandardScaler to ONNX...")
    onx_scaler = convert_sklearn(scaler, initial_types=initial_type)
    
    with open(onnx_scaler_path, "wb") as f:
        f.write(onx_scaler.SerializeToString())
    print(f"Successfully saved {onnx_scaler_path}")

    print("All models successfully converted to ONNX! It is now safe to delete the .pkl files.")

if __name__ == "__main__":
    main()
