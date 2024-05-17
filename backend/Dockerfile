FROM python:3.10

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

ARG SQLLITE
ARG CORS_ALLOWED_ORIGINS
ARG ALLOWED_HOSTS

ENV SQLLITE $SQLLITE
ENV CORS_ALLOWED_ORIGINS $CORS_ALLOWED_ORIGINS
ENV ALLOWED_HOSTS $ALLOWED_HOSTS

CMD ["gunicorn", "-b", ":8000", "ai-backend-starter.wsgi:application"]
