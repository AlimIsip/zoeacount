from picamera2 import Picamera2
camera = Picamera2()
camera.start()
camera.capture_file("test.jpg")
camera.stop()
camera.close()
print("Captured test image.")