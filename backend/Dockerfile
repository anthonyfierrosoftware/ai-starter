FROM python:3.12

RUN apt update -y && apt full-upgrade -y && apt autoremove -y && apt clean -y && apt autoclean -y

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["./docker-entrypoint.sh"]
