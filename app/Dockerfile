# Use an official Python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements.txt file into the container
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app code
COPY . .

# Expose the port Flask will run on
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]
