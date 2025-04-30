from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests

# Load dataset
top_movies = pd.read_csv('top_movies_by_genre.csv')

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    selected_genres = data.get('genres', [])

    if not selected_genres:
        return jsonify([])

    
    recommendations = pd.DataFrame()

    for genre in selected_genres:
        genre_movies = top_movies[top_movies['genres'].str.contains(genre, case=False, regex=False)]
        top_genre_movies = genre_movies.sort_values(by='rating', ascending=False).head(5)
        recommendations = pd.concat([recommendations, top_genre_movies])

    # Remove duplicates by title 
    recommendations = recommendations.drop_duplicates(subset='title')

    # Sort final results by rating and optionally limit total to 20
    recommendations = recommendations.sort_values(by='rating', ascending=False).head(10)

    result = recommendations[['title', 'genres', 'rating']].to_dict(orient='records')
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
