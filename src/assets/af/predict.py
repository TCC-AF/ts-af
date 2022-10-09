# ======== IMPORTS ======== #
import os
import json
import tensorflow as tf
import numpy as np
from scipy.signal import resample, butter, sosfiltfilt

# ======== VARIABLES ======== #
tflite_model_name = "model_custom.tflite"
tflite_model_path = os.path.join('.', tflite_model_name)

# ======== PRE-PROCESSING ======== #
def second_largest(array):
    sortedgivenArray = np.squeeze(np.asarray(sorted(array, reverse = True)))
    secondLargestNumber = sortedgivenArray[1]
    return secondLargestNumber

def normalise_length_zero_pad(sig, NL):
    signal_length = len(sig)
    if signal_length > NL:
        interval_start = (signal_length - NL) / 2
        return sig[np.int64(np.floor(interval_start)):signal_length - np.int64(np.ceil(interval_start))]
    elif signal_length < NL:
        pad_length = (NL - signal_length) / 2
        return np.pad(sig, (np.int64(np.floor(pad_length)), np.int64(np.ceil(pad_length))), 'constant')
    else:
        return sig

def apply_filter(sig_array):
    sos = butter(11, (0.014, 0.3), 'bandpass', output='sos')
    filtered = sosfiltfilt(sos, sig_array)
    filtered = filtered / np.amax(filtered)
    if np.amin(filtered) < -1.0:
        filtered = filtered / abs(np.amin(filtered))
    return filtered

def process_entry_tflite(model_path, ecg_data):
  interpreter = tf.lite.Interpreter(model_path)

  # Filtering, padding, normalisation
  tempF = np.squeeze(apply_filter(ecg_data))
  tempN = normalise_length_zero_pad(tempF, 7500)
  tempNR = resample(tempN, 3000)

  tempNRR = np.array(tempNR, dtype=np.float32)
  tempNRF = np.expand_dims(tempNRR, axis=1)

  print(tempNRF)
  a_file = open("test.txt", "w")
  for row in tempNRF:
      np.savetxt(a_file, row)

  input_details = interpreter.get_input_details()
  output_details = interpreter.get_output_details()
  interpreter.allocate_tensors()

  # input_details[0]['index'] = the index which accepts the input
  interpreter.set_tensor(input_details[0]['index'], [tempNRF])

  interpreter.invoke()

  # output_details[0]['index'] = the index which provides the output
  output_data = interpreter.get_tensor(output_details[0]['index'])

  Prediction = np.argmax(output_data)+1
  PredictionProb = output_data
  Thresh = np.array([0.95, 0.91])
  if np.max(PredictionProb)<Thresh[0] and (np.max(PredictionProb)-second_largest(PredictionProb))<Thresh[1]:
    Reject = 1
  else:
    Reject = 0

  print('PredictionProb: ', PredictionProb)

  return Prediction, Reject

# ======== RUN FUNCTIONS ======== #
def run_tflite(request):
  try:
      prediction, reject = process_entry_tflite(tflite_model_path, request)
      result = {
          'prediction': int(prediction),
          'reject': int(reject),
          'model': tflite_model_name
      }

      return result

  except Exception as e:
    error = str(e)
    return{'data' : error, "message" : 'unable to classify sample'}

def run_prediction_tflite(type, filename):
  # sample_name = "ecg.json"
  # sample_name = "0008-3.txt"
  print(filename)
  sample_path = os.path.join('./ecg_samples', filename)

  # JSON
  if(type=='json'):
      f = open (sample_path, "r")
      json_data = json.loads(f.read())
      json_run = run_tflite(json_data[3])
      print(json_run)

  # TEXT
  elif(type=='txt'):
    ft = np.genfromtxt(sample_path, dtype=int)
    text_run = run_tflite(ft)
    print(text_run)

# ======== CALL PREDICT FUNCTION ======== #
# type can be 'json' or 'txt'
run_prediction_tflite('json', 'ecg.json')
# run_prediction_tflite('txt', '0006-6.txt')





# ======== ARCHIVE ======== #
# def run_tflite(type, request):
#   try:
#     if(type=='json'):
#       data = json.loads(request)
#       ecg = data.get('value')[3]
#       ecgnp = np.array(ecg)
#       print(ecgnp)
#     elif(type=='txt'):
#       data = request
#       ecgnp = np.array(data)
#       print(ecgnp)

#       prediction, reject = process_entry_tflite(tflite_model_path, request)
#       result = {
#           'prediction': int(prediction),
#           'reject': int(reject),
#           'model': tflite_model_name
#       }

#       return result

#   except Exception as e:
#     error = str(e)
#     return{'data' : error, "message" : 'unable to classify sample'}

# def run_prediction_tflite(type, filename):
  # sample_name = "ecg.json"
  # sample_name = "0008-3.txt"
  # sample_path = os.path.join('./ecg_samples', filename)

  # JSON
  # if(type=='json'):
  #   f = open (sample_path, "r")
  #   json_data = json.loads(f.read())
  #   json_prop = {'value': json_data}
  #   json_dump = json.dumps(json_prop)
  #   json_run = run_tflite(type, json_dump)
  #   print(json_run)

  # TEXT
  # elif(type=='txt'):
  #   ft = np.genfromtxt(sample_path, dtype=int)
  #   text_run = run_tflite(type, ft)
  #   print(text_run)