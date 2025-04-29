from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

top_movies = pd.read_csv('top_movies_by_genre.csv')

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_genres = data.get('genres', [])
    
    recs = top_movies[top_movies['genres'].isin(user_genres)]
    recs = recs.sort_values('rating', ascending=False).drop_duplicates('movieId').head(10)

    result = recs[['title', 'genres', 'rating']].to_dict(orient='records')
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
