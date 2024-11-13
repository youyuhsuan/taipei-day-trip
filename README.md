# [Taipei Day Trip](https://youyuhsuan.com/)

_A travel e-commerce website that allows users to browse and book Taipei city tours._

<div style="display:inline-flex; align-items: center;">
  <img src="app/static/src/image/icon/wehelp.svg" alt="Wehelp" width="150" style="margin-right: 0.5rem; object-fit: contain;">
  <img src="docs/taipei-day-trip.png" alt="Logo" style="height: auto; width: 100%; object-fit: contain;">
</div>

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema Documentation](#database-schema-documentation)
- [System Architecture](#system-architecture)
- [Docker Setup](#docker-setup)
- [Test Credentials](#test-credentials)
- [Test Card](#test-card)

## Tech Stack

- **Backend**: FastAPI, Python 3.12
- **Database**: MySQL
- **Payment**: TapPay (for payment gateway integration)
- **Authentication**: JWT (JSON Web Token)
- **Deployment**: Docker, Docker Compose
- **CI/CD**: GitHub Actions for continuous integration and deployment

---

## Features

- **User Authentication**: Secure login and registration using JWT tokens.
- **Tour Browsing**: Browse available tours with detailed information.
- **Booking System**: Book tours directly through the platform.
- **Payment Integration**: Pay for bookings via TapPay.
- **Booking Management**: View and manage your bookings.

---

## Installation

To get the project up and running on your local machine, follow these steps:

### Prerequisites

- Python 3.12+
- Poetry (for Python dependency management)
- Docker (optional, if using Docker setup)

### Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone [repository_url]
   cd taipei-day-trip
   ```

2. **Set up the virtual environment with Poetry**

   ```bash
   env use python3.12
   poetry install
   poetry shell
   ```

3. **Set up environment variables: Create a .env file in the project root directory with the following variables.**

---

## Environment Variables

This project requires the following environment variables to be set in a `.env` file.

| Variable                 | Description              | Example                             |
| ------------------------ | ------------------------ | ----------------------------------- |
| MYSQL_USER               | Database username        | `postgres`                          |
| MYSQL_DATABASE           | Database name            | `database_name`                     |
| MYSQL_PASSWORD           | Database password        | `your_password`                     |
| TAPPAY_SANDBOX_URL       | TapPay sandbox API URL   | `https://sandbox.tappaysdk.com/api` |
| PARTNER_KEY              | TapPay partner key       | `your_partner_key`                  |
| MERCHANT_ID              | TapPay merchant ID       | `your_merchant_id`                  |
| SECRET_KEY               | JWT secret key           | `your_secret_key`                   |
| ALGORITHM                | JWT encryption algorithm | `HS256`                             |
| ACCESS_TOKEN_EXPIRE_DAYS | Token expiration in days | `7`                                 |

---

## Docker Setup

This project includes Docker and Docker Compose configuration for containerizing the application.
To build and run the application using Docker:

1. **Run the application with Docker Compose**

   ```bash
   docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d
   ```

2. **To stop the containers**
   ```bash
   docker-compose down
   ```

## [API Documentation](https://youyuhsuan.com/docs)

## [Database Schema Documentation](https://dbdiagram.io/d/67271d9ab1b39dd85849dd13)

<img src="docs/database-schema.png" alt="Database Schema" style="max-width: 100%; height: auto;">

## System Architecture

<img src="docs/system-architecture.png" alt="System Architecture" style="max-width: 100%; height: auto;">

## Test Credentials

| Item     | Content          |
| :------- | :--------------- |
| Email    | test01@gmail.com |
| Password | Test01           |

## Test Card

For development and testing, please use the following test card:

| Item        | Content             |
| :---------- | :------------------ |
| Card Number | 4242 4242 4242 4242 |
| CVV         | 01/23               |
| Expiry Date | 123                 |

Note: Ensure the expiry date is always set to a future date for testing.
