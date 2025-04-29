# FilmFusion
A database for movies

## Step 1:
Run `Database.sql` using MySQL

## Step 2:
```
cd Backend
npm i
```

Create a .env file.
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<Password>
DB_NAME=movies_db
APP_PORT=4500
EMAIL=<Your email address>
EMAIL_PW=<Your email password>
JWT_SECRET=cb0a83459ea950c15d48ed749465c6a6294dcb694dd0f4b06c6f5b8654e10f2e0c292110678e64bba13539f32756b9e6984128e4d1df6136f065548188a41bd1

```

Now, start the server:
```
npm run devStart
```

## Step 3:
```
cd Frontend
npm i
npm run dev
```

## Step 4:
```
cd DataModel
pip install flask pandas
pip install flask-cors
python recommender.py
```

# keep the server running