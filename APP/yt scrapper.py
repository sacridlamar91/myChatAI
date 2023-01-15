# Import necessary libraries
import os
import googleapiclient.discovery
import googleapiclient.errors
import spacy

# Load the spaCy model for sentiment analysis
nlp = spacy.load('en_core_web_md')

# Set the YouTube API key and video ID
API_KEY = 'AIzaSyB6Ur0vtcpbx0mRB-4EU-SajEXnQCEfHJM'
video_id = 'https://youtu.be/uXb4ufZ_QHk'

# Set up the YouTube API client
youtube = googleapiclient.discovery.build('youtube', 'v3', developerKey=API_KEY)

# Request the comments for the video
request = youtube.commentThreads().list(part='snippet', videoId=video_id, textFormat='plainText')
response = request.execute()

# Iterate through the comments
for item in response['items']:
  comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
  print(comment)

  # Analyze the sentiment of the comment using spaCy
  doc = nlp(comment)
  print(doc.sentiment)

