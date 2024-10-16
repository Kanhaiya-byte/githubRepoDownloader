from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import requests
import os
import io

app = Flask(__name__)
CORS(app)

DOWNLOAD_DIR = 'downloads'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

def download_repository(repo_url):
    parts = repo_url.split('/')
    if len(parts) != 2:
        raise ValueError("Invalid repository URL format. It should be 'owner/repo'.")
    owner, repo = parts

    branch = 'main'

    try:
        zip_url = f'https://github.com/{owner}/{repo}/archive/refs/heads/{branch}.zip'
        response = requests.get(zip_url, stream=True)
        response.raise_for_status()
    except requests.HTTPError as e:
        if response.status_code == 404:
            zip_url = f'https://github.com/{owner}/{repo}/archive/refs/heads/master.zip'
            response = requests.get(zip_url, stream=True)
            response.raise_for_status()
        else:
            raise e

    return response.content, f'{repo}.zip'

@app.route('/download', methods=['POST'])
def download():
    repo_url = request.get_json().get('repo_url')

    if not repo_url:
        return jsonify({"error": "repo_url is required"}), 400

    try:
        file_content, archive_name = download_repository(repo_url)

        return send_file(
            io.BytesIO(file_content),
            as_attachment=True,
            download_name=archive_name,
            mimetype='application/zip'
        )
    except Exception as e:
        app.logger.error(f"Error downloading repository: {str(e)}")
        return jsonify({"error": f"Failed to download repository: {str(e)}"}), 500

@app.route('/')
def home():
    return "Welcome to the GitHub Repository Downloader API!"

if __name__ == '__main__':
    app.run(debug=True,port=5000)
