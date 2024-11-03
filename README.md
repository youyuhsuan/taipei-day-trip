# [Taipei Day Trip](https://)

_A travel e-commerce website that allows users to browse and book Taipei city tours._

## Tech Stack

- **Backend**: FastAPI, Python 3.12
- **Database**: MySQL
- **Payment**: TapPay
- **Authentication**: JWT

## Features

- User authentication and authorization
- Tour browsing and searching
- Booking and payment integration
- Booking management system

## API

[API Taipei Day Trip Docs](http://127.0.0.1:8000/docs)

## Requirement

### Prerequisites

- Python 3.12
- Poetry
- MySQL

### Installation

1. Clone the repository

   ```bash
   git clone [repository_url]
   cd taipei-day-trip
   ```

2. Set up virtual environment with Poetry
   ```bash
   env use python3.12
   poetry install
   poetry shell
   ```

### Environment Variables

This project requires the following environment variables to be set in a `.env` file.

| Variable                 | Description              | Example                             |
| ------------------------ | ------------------------ | ----------------------------------- |
| **Database**             |
| MYSQL_USER               | Database username        | `postgres`                          |
| MYSQL_DATABASE           | Database name            | `database_name`                     |
| MYSQL_PASSWORD           | Database password        | `your_password`                     |
| **TapPay Integration**   |
| TAPPAY_SANDBOX_URL       | TapPay sandbox API URL   | `https://sandbox.tappaysdk.com/api` |
| PARTNER_KEY              | TapPay partner key       | `your_partner_key`                  |
| MERCHANT_ID              | TapPay merchant ID       | `your_merchant_id`                  |
| **JWT Settings**         |
| SECRET_KEY               | JWT secret key           | `your_secret_key`                   |
| ALGORITHM                | JWT encryption algorithm | `HS256`                             |
| ACCESS_TOKEN_EXPIRE_DAYS | Token expiration in days | `7`                                 |

### Project Structure

```bash
taipei-day-trip/
├── app/                         # Application core
│   ├── api/                     # API layer
│   │   ├── controllers/         # Business logic
│   │   ├── models/              # Database models
│   │   ├── views/               # Response formatting
│   │   ├── schemas/             # Data validation
│   │   └── routers/             # Route definitions
│   │
│   ├── core/                     # Core functionality
│   │   ├── config.py            # Configuration
│   │   └── database.py          # Database setup
│   │
│   ├── static/                   # Static assets
│   │   ├── html/                # HTML templates
│   │   ├── images/              # Image assets
│   │   ├── js/                  # JavaScript files
│   │   ├── scss/                # SCSS sources
│   │   └── css/                 # Compiled CSS
│   │
│   ├── sources/                     # Data sources and processing
│   │   ├── taipei-attractions.json # Taipei attractions data processing
│   │   └── data.py                # Raw data handling
│   │
│   ├── utils/                    # Utility functions
│   │   └── render_response.py    # Response helpers
│   │
│   └── __init__.py               # Application entry
│
├── tests/                        # Test suite
│   ├── unit/
│   └── integration/
│
├── docs/                         # Documentation
├── main.py                       # Application entry
└── README.md                     # Project readme
```

# Test Credentials

## Test Account

| Item     | Content          |
| :------- | :--------------- |
| Email    | user@example.com |
| Password | string           |

## Test Card

For development and testing, please use the following test card:

| Item        | Content             |
| :---------- | :------------------ |
| Card Number | 4242 4242 4242 4242 |
| CVV         | 01/23               |
| Expiry Date | 123                 |

Note: Ensure the expiry date is always set to a future date for testing.
