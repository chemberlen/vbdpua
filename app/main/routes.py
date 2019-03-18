from datetime import datetime
from flask import render_template, flash, redirect, url_for, request, g,jsonify, current_app, send_from_directory
from flask_login import current_user, login_required
from flask_babel import _, get_locale
from guess_language import guess_language
from app import db, Config
from app.main.forms import EditProfileForm, PostForm, SearchForm
from app.models import User, Post
from app.translate import translate
from app.main import bp
import os


APP_ROOT = os.path.abspath('/home/teofedryn/microblog')   # refers to application_top
APP_ROOT_BP = os.path.abspath('/home/teofedryn/microblog/app')   # refers to bluprint application_top

def joinurl(baseurl, filename):
    urldata = os.path.join(baseurl,filename)
    return urldata

@bp.before_app_request
def before_request():
    if current_user.is_authenticated:
        current_user.last_seen = datetime.utcnow()
        db.session.commit()
        g.search_form = SearchForm()
    g.locale = str(get_locale())



@bp.route('/')
@bp.route('/index')
# @login_required
def index():
    return render_template("index.html")


# @bp.route('/', methods=['GET', 'POST'])
@bp.route('/blog', methods=['GET', 'POST'])
# @login_required
def blog():
    # form = PostForm()
    # if form.validate_on_submit():
    #     language = guess_language(form.post.data)
    #     if language == 'UNKNOWN' or len(language) > 5:
    #         language = ''
    #     post = Post(body=form.post.data, author=current_user,language=language)
    #     db.session.add(post)
    #     db.session.commit()
    #     flash(_('Your post is now live!'))
    #     return redirect(url_for('main.blog'))
    page = request.args.get('page', 1, type=int)
    posts = Post.query.order_by(Post.timestamp.desc()).paginate(page, current_app.config['POSTS_PER_PAGE'], False)
    # posts = current_user.followed_posts().paginate(page, current_app.config['POSTS_PER_PAGE'], False)
    next_url = url_for('main.blog', page=posts.next_num) \
        if posts.has_next else None
    prev_url = url_for('main.blog', page=posts.prev_num) \
        if posts.has_prev else None
    return render_template('blog.html', title=_('Blog'),
                           posts=posts.items, next_url=next_url,
                           prev_url=prev_url)


# def allowed_file(filename):
#     return '.' in filename and \
#            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# @bp.route('/uploads/', methods=['GET', 'POST'])
# @login_required
# def uploads():
#     username = current_user.username
#     form = PhotoForm()
#     if request.method == 'POST':
#         filename = images.save(request.files['photo_file'])
#         url = images.url(filename)
#         current_user.image_url = url              #current_app.config['UPLOAD_FOLDER'] +  url
#         db.session.commit()
#         flash(_('Your changes have been saved.'))
#         return redirect(url_for('main.user',username=current_user.username,image_url = current_user.image_url))

        # # check if the post request has the file part
        # if 'file' not in request.files:
        #     flash('No file part')
        #     return redirect(request.url)
        # file = request.files['file']
        # # if user does not select file, browser also
        # # submit a empty part without filename
        # if file.filename == '':
        #     flash('No selected file')
        #     return redirect(request.url)
        # if file and allowed_file(file.filename):
        #     filename = secure_filename(file.filename)
        #     file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        #     return redirect(url_for('main.uploaded_file',
        #                             filename=filename))
    # return redirect(url_for('main.user',username=current_user.username,image = current_user.image_url))

@bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'],
                               filename)


@bp.route('/user/<username>', methods=['GET', 'POST'])
@login_required
def user(username):
    user = User.query.filter_by(username=username).first_or_404()
    if request.method == 'POST' and 'file' in request.files:
        filename = current_app.photos.save(request.files['photo'])
        img_path = current_app.photos.path(filename)
        user.image_url = img_path
        db.session.commit()
        flash(_('Your changes have been saved.'))
        return redirect(url_for('main.user', username=user.username))

    return render_template('user.html', user=user, image = user.image_url)


@bp.route('/creat_post', methods=['GET', 'POST'])
@login_required
def creat_post():
    form = EditProfileForm(current_user.username)
    if form.validate_on_submit():
        current_user.username = form.username.data
        current_user.about_me = form.about_me.data
        db.session.commit()
        flash(_('Your changes have been saved.'))
        return redirect(url_for('main.user',username=current_user.username))
    elif request.method == 'GET':
        form.username.data = current_user.username
        form.about_me.data = current_user.about_me
    return render_template('creat_post.html', title=_('Creat new post'),form=form)


@bp.route('/follow/<username>')
@login_required
def follow(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        flash(_('User %(username)s not found.', username=username))
        return redirect(url_for('main.blog'))
    if user == current_user:
        flash(_('You cannot follow yourself!'))
        return redirect(url_for('main.user', username=username))
    current_user.follow(user)
    db.session.commit()
    flash(_('You are following %(username)s!', username=username))
    return redirect(url_for('main.user', username=username))


@bp.route('/unfollow/<username>')
@login_required
def unfollow(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        flash(_('User %(username)s not found.', username=username))
        return redirect(url_for('main.blog'))
    if user == current_user:
        flash(_('You cannot unfollow yourself!'))
        return redirect(url_for('main.user', username=username))
    current_user.unfollow(user)
    db.session.commit()
    flash(_('You are not following %(username)s.', username=username))
    return redirect(url_for('main.user', username=username))


@bp.route('/translate', methods=['POST'])
@login_required
def translate_text():
    return jsonify({'text': translate(request.form['text'],
                                      request.form['source_language'],
                                      request.form['dest_language'])})


@bp.route('/search')
@login_required
def search():
    if not g.search_form.validate():
        return redirect(url_for('main.explore'))
    page = request.args.get('page', 1, type=int)
    posts, total = Post.search(g.search_form.q.data, page,
                               current_app.config['POSTS_PER_PAGE'])
    next_url = url_for('main.search', q=g.search_form.q.data, page=page + 1) \
        if total > page * current_app.config['POSTS_PER_PAGE'] else None
    prev_url = url_for('main.search', q=g.search_form.q.data, page=page - 1) \
        if page > 1 else None
    return render_template('search.html', title=_('Search'), posts=posts,
                           next_url=next_url, prev_url=prev_url)
