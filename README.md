# Taipei Day Trip

> A travel e-commerce website that allows users to browse and book Taipei city tours.

<div align="center">
  <a href="https://youyuhsuan.com/">
    <img src="app/static/src/image/icon/wehelp.svg" alt="Wehelp" width="100" style="margin-right: 20px">
    <img src="docs/taipei-day-trip.png" alt="Logo" width="Taipei day trip" height="80">
  </a>
</div>

## Quick Links

- [Live Demo](https://youyuhsuan.com/)
- [API Documentation](https://youyuhsuan.com/docs)
- [Database Schema](https://dbdiagram.io/d/67271d9ab1b39dd85849dd13)
- [Docker Image](https://hub.docker.com/r/stellayou/taipei-day-trip)

## Demo

### Index Page

Experience our intuitive homepage design where users can effortlessly browse through various tour options.

<div align="center">
  <img src="docs/index.gif" alt="Index Page Demo" width="100%">
</div>

### Attraction Details

Explore detailed information about each attraction, including descriptions, images, and booking options.

<div align="center">
  <img src="docs/attraction.gif" alt="Attraction Page Demo" width="100%">
</div>

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
- [Database Schema Documentation](#database-schema-documentation)
- [System Architecture](#system-architecture)
- [Docker Setup](#docker-setup)
- [Test Credentials](#test-credentials)
- [Test Card](#test-card)

## Tech Stack

### Frontend

<div>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="SCSS"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
</div>

### Backend & Database

<div>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT"/>
</div>

### DevOps & Tools

<div>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions"/>
  <img src="https://img.shields.io/badge/Poetry-60A5FA?style=for-the-badge&logo=poetry&logoColor=white" alt="Poetry"/>
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git"/>
</div>

### Cloud & Infrastructure

<div>
  <img src="https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white" alt="AWS EC2"/>
  <img src="https://img.shields.io/badge/Route_53-8C4FFF?style=for-the-badge&logo=amazonroute53&logoColor=white" alt="Route 53"/>
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx"/>
</div>

## Features

- **User Authentication**: Secure login and registration using JWT tokens.
- **Tour Browsing**: Browse available tours with detailed information.
- **Booking System**: Book tours directly through the platform.
- **Payment Integration**: Pay for bookings via TapPay.
- **Booking Management**: View and manage your bookings.

## Installation

### Prerequisites

- Python 3.12+
- Poetry (for Python dependency management)
- Docker (optional, if using Docker setup)

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone [repository_url]
   cd taipei-day-trip
   ```

2. **Set up the virtual environment with Poetry**

   ```bash
   poetry install
   poetry shell
   ```

3. **Configure environment variables**
   - Create a `.env` file in the project root directory
   - See `.env.example` for required variables

## Docker Setup

1. **Pull from Docker Hub**

   ```bash
   docker pull stellayou/taipei-day-trip
   ```

2. **Run with Docker Compose**
   ```bash
   docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d
   ```

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
