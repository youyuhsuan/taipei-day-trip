# 使用官方 Python 基礎鏡像
FROM python:3.12.4-slim

WORKDIR /my-app

COPY requirements.txt .

RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

ENTRYPOINT [ "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000" ]