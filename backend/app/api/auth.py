from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from app.models.user import User
from app import db
from flask import jsonify, request
from . import api
auth = Blueprint('auth', __name__)

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print(data)
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': '用户名已存在'}), 400
        
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': '邮箱已被使用'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        nickname=data.get('nickname', data['username'])
    )
    user.password = data['password']
    user.save()
    
    return jsonify({'message': '注册成功'}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    print(user.id)
    if user and user.verify_password(data['password']):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
    
    return jsonify({'message': '用户名或密码错误'}), 401

@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify(user.to_dict()), 200

@api.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "pong"})