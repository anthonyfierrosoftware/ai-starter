FROM node:lts as build

RUN apt update -y && apt full-upgrade -y && apt autoremove -y && apt clean -y && apt autoclean -y

COPY package-lock.json ./
COPY package.json ./

RUN npm ci

COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL $REACT_APP_API_URL
ENV GENERATE_SOURCEMAP=false
RUN npm run build

FROM nginx:alpine

COPY --from=build build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
