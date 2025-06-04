from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.post import Post, post_likes, post_favorites
from app.models.forum import Forum
from app.models.comment import Comment
from app import db
from . import api

@api.route('/posts', methods=['GET'])
def get_posts():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    pagination = Post.query.order_by(Post.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'posts': [post.to_dict() for post in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': pagination.page
    })

@api.route('/posts/<int:post_id>', methods=['GET'])
@jwt_required()
def get_post_by_id(post_id):
    post = Post.query.get_or_404(post_id)
    post.view_count += 1
    db.session.commit()
    
    current_user_id = None
    is_liked = False    
    try:
        current_user_id = get_jwt_identity()
        if current_user_id:
            # 检查当前用户是否点赞过
            like_record = db.session.query(post_likes).filter_by(
                user_id=current_user_id,
                post_id=post_id
            ).first()
            is_liked = like_record is not None
            
            # 检查是否收藏过
            favorite_record = db.session.query(post_favorites).filter_by(
                user_id=current_user_id,
                post_id=post_id
            ).first()
            is_favorited = favorite_record is not None
    except Exception as e:
        print('获取点赞状态失败:', str(e))    
    response_data = post.to_dict()
    response_data['isLiked'] = is_liked
    response_data['isFavorited'] = is_favorited
    return jsonify(response_data)

@api.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    try:
        data = request.get_json()
        print(data)
        if not data:
            return jsonify({'message': '无效的请求数据'}), 400

        user_id = get_jwt_identity()
        
        title = data.get('title')
        content = data.get('content')
        forum_id = data.get('forum_id')
        
        if not all([title, content, forum_id]):
            return jsonify({'message': '缺少必要字段'}), 400
    
        try:
            forum_id = int(forum_id)
        except (TypeError, ValueError):
            return jsonify({'message': '版块ID必须是数字'}), 422
            
        # 验证版块是否存在
        forum = Forum.query.get(forum_id)
        if not forum:
            return jsonify({'message': '版块不存在'}), 404
              # 创建帖子
        post = Post(
            title=title,
            content=content,
            user_id=user_id,
            forum_id=forum_id
        )
        db.session.add(post)
        db.session.commit()
        
        return jsonify({
            'message': '发帖成功',
            'post': post.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'发帖失败: {str(e)}'}), 500

@api.route('/posts/<int:id>', methods=['GET'])
def get_post(id):
    post = Post.query.get_or_404(id)
    post.views += 1
    post.save()
    return jsonify({'data': post.to_dict()})

@api.route('/forums/<int:forum_id>/posts', methods=['GET'])
def list_forum_posts(forum_id):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    forum = Forum.query.get_or_404(forum_id)
    pagination = Post.query.filter_by(forum_id=forum_id)\
        .order_by(Post.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'posts': [post.to_dict() for post in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': pagination.page
    })

@api.route('/posts/<int:post_id>/comments', methods=['GET'])
def get_post_comments(post_id):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    post = Post.query.get_or_404(post_id)
    pagination = post.comments.order_by(Comment.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'comments': [comment.to_dict() for comment in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': pagination.page
    })

@api.route('/posts/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def create_comment(post_id):
    try:
        data = request.get_json()
        if not data or 'content' not in data:
            return jsonify({'message': '评论内容不能为空'}), 400

        user_id = get_jwt_identity()
        post = Post.query.get_or_404(post_id)
        
        comment = Comment(
            content=data['content'],
            user_id=user_id,
            post_id=post_id
        )
        
        db.session.add(comment)
        post.comment_count += 1
        db.session.commit()
        
        return jsonify({
            'message': '评论成功',
            'comment': comment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'评论失败: {str(e)}'}), 500

@api.route('/posts/<int:post_id>/like', methods=['POST'])
@jwt_required()
def like_post(post_id):
    try:
        user_id = get_jwt_identity()
        post = Post.query.get_or_404(post_id)
        
        # 检查是否已经点赞
        existing_like = db.session.query(post_likes).filter_by(
            user_id=user_id, 
            post_id=post_id
        ).first()
        
        is_liked = False
        if existing_like:
            # 取消点赞
            db.session.execute(
                post_likes.delete().where(
                    post_likes.c.user_id == user_id,
                    post_likes.c.post_id == post_id
                )
            )
            post.like_count = post.like_count - 1 if post.like_count > 0 else 0
        else:
            # 添加点赞
            db.session.execute(
                post_likes.insert().values(
                    user_id=user_id,
                    post_id=post_id
                )
            )
            post.like_count = (post.like_count or 0) + 1
            is_liked = True
            
        db.session.commit()
        return jsonify({
            'message': '操作成功',
            'is_liked': is_liked,
            'like_count': post.like_count
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'操作失败: {str(e)}'}), 500

@api.route('/posts/<int:post_id>/favorite', methods=['POST'])
@jwt_required()
def favorite_post(post_id):
    user_id = get_jwt_identity()
    post = Post.query.get_or_404(post_id)
    
    if post.is_favorited_by(user_id):
        post.unfavorite(user_id)
        return jsonify({'message': '取消收藏成功', 'is_favorited': False})
    else:
        post.favorite(user_id)
        return jsonify({'message': '收藏成功', 'is_favorited': True})

@api.route('/posts/<int:post_id>/share', methods=['POST'])
def share_post(post_id):
    post = Post.query.get_or_404(post_id)
    post.share_count += 1
    db.session.commit()
    return jsonify({'message': '分享成功', 'share_count': post.share_count})

@api.route('/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    try:
        current_user_id = get_jwt_identity()
        comment = Comment.query.get_or_404(comment_id)
        
        # 检查是否是评论作者或版主
        if comment.user_id != int(current_user_id) and not comment.post.forum.is_moderator(current_user_id):
            return jsonify({'message': '没有权限删除此评论'}), 403
            
        post = comment.post
        post.comment_count -= 1
        
        db.session.delete(comment)
        db.session.commit()
        
        return jsonify({'message': '评论删除成功'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'删除评论失败: {str(e)}'}), 500