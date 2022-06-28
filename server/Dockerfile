FROM node:16.15.0-slim

RUN apt-get update
RUN apt-get install python3-pip -y
RUN apt-get install ffmpeg -y

RUN python3 -m pip install --upgrade pip setuptools wheel
RUN pip3 install librosa
RUN pip3 install yt_dlp
RUN pip3 install tensorflow

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "server"]