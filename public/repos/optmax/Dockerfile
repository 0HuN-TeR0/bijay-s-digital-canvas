# OptMax Dockerfile
# =================

FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY src/ ./src/
COPY data/ ./data/

# Expose port
EXPOSE 8000

# Run the API
CMD ["python", "src/api.py"]
