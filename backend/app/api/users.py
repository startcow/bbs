from flask import jsonify, request
from . import api

@api.route('/users', methods=['GET'])
def get_users():
    return jsonify({"message": "users list"})