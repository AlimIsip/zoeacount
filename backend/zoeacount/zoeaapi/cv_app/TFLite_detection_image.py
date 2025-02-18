import os
import cv2
import numpy as np
import glob
import random
from tensorflow.lite.python.interpreter import Interpreter
import matplotlib.pyplot as plt


def slice_image(image_path, output_folder, slice_size=(320, 320), stride=(80, 80)):
    os.makedirs(output_folder, exist_ok=True)
    image = cv2.imread(image_path)
    h, w, _ = image.shape
    slice_w, slice_h = slice_size
    stride_w, stride_h = stride
    slice_count = 0
    slices = []

    total_slices = ((h - slice_h) // stride_h + 1) * ((w - slice_w) // stride_w + 1)
    print(f"[INFO] Total slices to be processed: {total_slices}")

    print(f"[INFO] Slicing image: {image_path} ({w}x{h}) with stride {stride_w}x{stride_h}")

    for y in range(0, h - slice_h + 1, stride_h):
        for x in range(0, w - slice_w + 1, stride_w):
            slice_img = image[y:y + slice_h, x:x + slice_w]
            slice_filename = os.path.join(output_folder, f'slice_{slice_count}_{x}_{y}.jpg')
            cv2.imwrite(slice_filename, slice_img)
            slices.append((slice_filename, x, y))
            print(f"[INFO] Saved slice {slice_count}: {slice_img.shape}")
            slice_count += 1

    return slices


def apply_nms(boxes, scores, overlap_threshold=0.5):
    indices = cv2.dnn.NMSBoxes(boxes, scores, score_threshold=0.5, nms_threshold=overlap_threshold)
    return indices.flatten() if len(indices) > 0 else []


def detect_objects_tflite(model_path, label_path, image_slices, min_conf=0.5, max_size=100, max_area_ratio=0.03,
                          max_aspect_ratio=1.18, min_aspect_ratio=0.05, max_box_size=50):
    with open(label_path, 'r') as f:
        labels = [line.strip() for line in f.readlines()]

    interpreter = Interpreter(model_path=model_path)
    interpreter.allocate_tensors()

    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    height, width = input_details[0]['shape'][1:3]
    float_input = input_details[0]['dtype'] == np.float32

    detections_data = []
    total_detected_larvae = 0

    unique_detections = {}

    for image_path, offset_x, offset_y in image_slices:
        image = cv2.imread(image_path)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        imH, imW, _ = image.shape
        image_resized = cv2.resize(image_rgb, (width, height))
        input_data = np.expand_dims(image_resized, axis=0)

        if float_input:
            input_data = (np.float32(input_data) - 127.5) / 127.5

        interpreter.set_tensor(input_details[0]['index'], input_data)
        interpreter.invoke()

        boxes = interpreter.get_tensor(output_details[1]['index'])[0]
        classes = interpreter.get_tensor(output_details[3]['index'])[0]
        scores = interpreter.get_tensor(output_details[0]['index'])[0]

        valid_boxes = []
        valid_scores = []
        valid_classes = []

        for i in range(len(scores)):
            if scores[i] > min_conf:
                ymin, xmin, ymax, xmax = boxes[i]
                xmin, xmax = int(xmin * imW) + offset_x, int(xmax * imW) + offset_x
                ymin, ymax = int(ymin * imH) + offset_y, int(ymax * imH) + offset_y

                box_width = xmax - xmin
                box_height = ymax - ymin
                box_area = box_width * box_height
                image_area = imW * imH
                aspect_ratio = box_width / max(box_height, 1)

                if (scores[i] * 100) >  100 or (box_area / image_area) > max_area_ratio or aspect_ratio > max_aspect_ratio or aspect_ratio < min_aspect_ratio or box_width > max_box_size or box_height > max_box_size:
                    continue

                detection_tuple = (xmin, ymin, xmax, ymax)
                duplicate = False
                for existing in unique_detections:
                    ex_xmin, ex_ymin, ex_xmax, ex_ymax = existing
                    if abs(ex_xmin - xmin) <= 10 and abs(ex_ymin - ymin) <= 10 and abs(ex_xmax - xmax) <= 10 and abs(
                            ex_ymax - ymax) <= 10:
                        duplicate = True
                        break

                if not duplicate:
                    unique_detections[detection_tuple] = scores[i]
                    valid_boxes.append([xmin, ymin, xmax, ymax])
                    valid_scores.append(scores[i])
                    valid_classes.append(labels[int(classes[i])])

        indices = apply_nms(valid_boxes, valid_scores, overlap_threshold=0.5)
        final_detections = [(valid_classes[i], valid_scores[i], *valid_boxes[i]) for i in indices]

        total_detected_larvae += len(final_detections)
        detections_data.extend(final_detections)

        print(f"[INFO] Slice {image_path} - Detected {len(final_detections)} larvae")

    print(f"[INFO] Total detected larvae: {total_detected_larvae}")
    return detections_data


def reconstruct_image(original_image_path, detections, output_path):
    image = cv2.imread(original_image_path)

    print("[INFO] Reconstructing final image with detections")
    for obj_name, score, xmin, ymin, xmax, ymax in detections:
        cv2.rectangle(image, (xmin, ymin), (xmax, ymax), (10, 255, 0), 1)
        label = f'{int(score * 100)}%'
        cv2.putText(image, label, (xmin, ymin - 7), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (0, 0, 0), 1)

    cv2.imwrite(output_path, image)
    print(f"[INFO] Final image saved to {output_path}")


# # Example Usage
# input_image = "images/sample/0a34f18d-image_118.jpg"
# slices_folder = "slices"
# detections_folder = "detections"
# final_image_path = "output.jpg"
#
# slices = slice_image(input_image, slices_folder)
# detections = detect_objects_tflite("custom_model_lite/detect.tflite", "labelmap.txt", slices)
# reconstruct_image(input_image, detections, final_image_path)

#
# input_image = "images/sample/0a34f18d-image_118.jpg"
# def detect_objects_tflite(model_path, label_path, image_slices, min_conf=0.5, max_size=100, max_area_ratio=0.03,
#                           max_aspect_ratio=1.18, min_aspect_ratio=0.05, max_box_size=30):