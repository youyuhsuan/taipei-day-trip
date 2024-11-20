FROM python:3.12.4-slim

WORKDIR /taipei-day-trip

ARG VERSION
ARG MYSQL_DATABASE
ARG MYSQL_HOST
ARG MYSQL_PORT
ARG MYSQL_USER
ARG MYSQL_PASSWORD
ARG MYSQL_ROOT_PASSWORD
ARG ACCESS_TOKEN_EXPIRE_DAYS
ARG ALGORITHM
ARG MERCHANT_ID
ARG SECRET_KEY
ARG PARTNER_KEY
ARG TAPPAY_SANDBOX_URL

COPY requirements.txt .

RUN python -m pip install --upgrade pip \
    && pip install -r requirements.txt \
    && rm -rf /root/.cache/pip

COPY . .

RUN echo "=== Root directory contents ===" && \
    ls -la && \
    echo "=== App/Static directory contents ===" && \
    ls -la app/static/

RUN echo "VERSION=${VERSION}\n\
MYSQL_DATABASE=${MYSQL_DATABASE}\n\
MYSQL_HOST=${MYSQL_HOST}\n\
MYSQL_PORT=${MYSQL_PORT}\n\
MYSQL_USER=${MYSQL_USER}\n\
MYSQL_PASSWORD=${MYSQL_PASSWORD}\n\
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}\n\
ACCESS_TOKEN_EXPIRE_DAYS=${ACCESS_TOKEN_EXPIRE_DAYS}\n\
ALGORITHM=${ALGORITHM}\n\
MERCHANT_ID=${MERCHANT_ID}\n\
SECRET_KEY=${SECRET_KEY}\n\
PARTNER_KEY=${PARTNER_KEY}\n\
TAPPAY_SANDBOX_URL=${TAPPAY_SANDBOX_URL}" > .env

EXPOSE 8000

ENTRYPOINT ["uvicorn"]
CMD ["app:app", "--host", "0.0.0.0", "--port", "8000"]
