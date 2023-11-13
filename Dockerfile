# Use an official Python runtime as a parent image
FROM python:3.8

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1

# Set the working directory in the container
WORKDIR /app

# Install Git
RUN apt-get update && apt-get install -y git

# Clone the GitHub repository
RUN git clone https://github.com/Radhika-naik/self-diagnosis-of-pneumonia.git .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV FLASK_APP app.py

# Run app.py when the container launches
CMD ["flask", "run", "--host=0.0.0.0"]
