# Travel Tracker App

The Travel Tracker is a Node.js application that allows users to select a country and see it highlighted on the map. This project is an example of using CRUD operations with Express and PostgreSQL, combined with server-side rendering using EJS.

## Prerequisites

Before running the project locally, ensure you have the following prerequisites:

- Node.js installed
- PostgreSQL installed
- A PostgreSQL database named "world" created
- Tables "users," "visited_countries," and "countries" created with the specified columns.

### Database Schema:

- "users" table:
  - id (serial primary key)
  - name (text)
  - color (text)

- "visited_countries" table:
  - id (serial primary key)
  - country_code (text)
  - user_id (integer, references "users" table)

- "countries" table:
  - country_code (text primary key)
  - country_name (text)

## Installation

To run this project locally, follow these steps:

```shell
# Install project dependencies
npm install

# Start the application
npm start

