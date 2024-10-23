This is Group 40's CS2340 Project 2 for the Fall 2024 semester.

## Setup (Windows)
### backend/
From the root project directory, run
```
cd backend
```
1. Create a virtual environment.
```
python -m venv .venv
```
2. Activate the virtual environment.
```
./.venv/Scripts/activate
```
3. Install required dependencies.
```
pip install -r requirements.txt
```
4. Make necessary Django migrations.
```
python manage.py makemigrations
python manage.py migrate
```
From here, you should be able to start the Django server with:
```
python manage.py runserver
```
### frontend/
From the root project directory, run
```
cd frontend
```
1. Install [node.js + npm](https://nodejs.org/en) (if you haven't already)
2. Install required dependencies.
```
npm install
```
3. Add a .env file, with the following information:
```
REACT_APP_CLIENT_ID="<insert client id here>"
REACT_APP_CLIENT_SECRET="<insert client secret here>"
```
From here you should be able to start the app in development mode with
```
npm start
```
