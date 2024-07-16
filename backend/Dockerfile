FROM python:3.12.4

# These are removed as they currently have critical security vulnerabilities and are not required anyway
RUN apt remove git git-man libaom3 libopenexr-3-1-30 libopenexr-dev zlib1g-dev -y

RUN apt update -y && apt full-upgrade -y && apt autoremove -y && apt clean -y && apt autoclean -y

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["./docker-entrypoint.sh"]
