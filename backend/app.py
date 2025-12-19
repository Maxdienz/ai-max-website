from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room
from ai_max_engine import process_message
import os

app = Flask(__name__)
app.config.from_pyobject('config.Config')

# Cấu hình SocketIO cho cloud
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode='eventlet'
)

# Dictionary lưu thông tin người dùng theo socket_id
user_sessions = {}

@socketio.on('connect')
def handle_connect():
    print("Client connected")

@socketio.on('disconnect')
def handle_disconnect():
    socket_id = request.sid
    if socket_id in user_sessions:
        del user_sessions[socket_id]
    print("Client disconnected")

@socketio.on('set_user_info')
def handle_set_user_info(data):
    socket_id = request.sid
    user_name = data.get('name', 'unknown')
    user_sessions[socket_id] = {'name': user_name}
    join_room(socket_id)
    emit('user_info_set', {'name': user_name})

@socketio.on('message')
def handle_message(data):
    socket_id = request.sid
    user_info = user_sessions.get(socket_id, {'name': 'unknown'})
    user_name = user_info['name']
    
    response = process_message(data, user_name)
    emit('message', response)

@app.route('/')
def index():
    return "<h1>AI-MAX Backend is Running!</h1>"

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    socketio.run(app, host='0.0.0.0', port=port, debug=False)
