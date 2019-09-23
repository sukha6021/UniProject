from datetime import datetime
from flask import render_template, flash,get_flashed_messages, redirect, url_for, request, g, \
    jsonify, current_app
from flask_login import current_user, login_required
from app import db
from app.main.forms import EditProfileForm, QuestionForm, SearchForm ,AnswerForm
from app.models import User, Question , Answer
from app.main import bp
import json

@bp.before_app_request
def before_request():
    if current_user.is_authenticated:
        current_user.last_seen = datetime.utcnow()
        db.session.commit()
        g.search_form = SearchForm()

@bp.route('/', methods=['GET', 'POST'])
@bp.route('/index', methods=['GET', 'POST'])
@login_required
def index():
    form = QuestionForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            question = Question(title=form.title.data, body=form.question.data, author=current_user)
            db.session.add(question)
            db.session.commit()
            flash("Your question is live!")
            return redirect(url_for('main.index'))
        else : 
            errors = list(form.errors.keys())
            messages = list(form.errors.values())
            response = jsonify({
                'errors':errors ,
                'messages':messages })
            response.status_code = 400
            response.headers['Location'] = url_for('main.index')
            return response

    page = request.args.get('page', 1, type=int)
    questions = current_user.followed_questions().paginate(
        page, current_app.config['QUESTIONS_PER_PAGE'], False)
    next_url = url_for('main.index',page = questions.next_num) \
        if questions.has_next else None 
    prev_url = url_for('main.index', page=questions.prev_num) \
        if questions.has_prev else None  
    questions_dict = [q.to_dict() for q in questions.items ] 
    

   # prepare data for react
    nav_links = {
    "Home" : url_for('main.index') ,
    "Explore" : url_for('main.explore'),
    "Profile" : url_for('main.user', username=current_user.username),
    "Logout" : url_for('auth.logout')};
   
    context = {
        'nav_links' : nav_links ,
        'messages' : get_flashed_messages(),
        'current_user' : current_user.username,
        'show_form' : True , 
        'questions': questions_dict ,
        'next_url' : next_url , 
        'prev_url': prev_url,    
    }

    return render_template('index.html', title='Home' , frontend_data = json.dumps(context))

@bp.route('/explore')
@login_required
def explore():
    page = request.args.get('page', 1, type=int)
    questions = Question.query.order_by(Question.timestamp.desc()).paginate(
        page, current_app.config['QUESTIONS_PER_PAGE'], False)
    next_url = url_for('main.explore',page = questions.next_num) \
        if questions.has_next else None 

    prev_url = url_for('main.explore', page=questions.prev_num) \
        if questions.has_prev else None  
    questions_dict = [q.to_dict() for q in questions.items ]  
       
    nav_links = {
        "Home" : url_for('main.index') ,
        "Explore" : url_for('main.explore'),
        "Profile" : url_for('main.user', username=current_user.username),
        "Logout" : url_for('auth.logout')};
   
    context = {
        'nav_links' : nav_links ,
        'messages' : get_flashed_messages(),
        'current_user' : current_user.username,
        'show_form' : False,
        'questions': questions_dict ,
        'next_url' : next_url , 
        'prev_url': prev_url,
    }

    return render_template('index.html', title='Explore',frontend_data = json.dumps(context))

@bp.route('/follow/<username>')
@login_required
def follow(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        flash('User {} not found.'.format(username))
        return redirect(url_for('main.index'))
    if user == current_user:
        flash('You cannot follow yourself!')
        return redirect(url_for('main.user', username=username))
    current_user.follow(user)
    db.session.commit()
    flash('You are following {}!'.format(username))
    return redirect(url_for('main.user', username=username))

@bp.route('/unfollow/<username>')
@login_required
def unfollow(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        flash('User {} not found.'.format(username))
        return redirect(url_for('main.index'))
    if user == current_user:
        flash('You cannot unfollow yourself!')
        return redirect(url_for('main.user', username=username))
    current_user.unfollow(user)
    db.session.commit()
    flash('You are not following {}.'.format(username))
    return redirect(url_for('main.user', username=username))


@bp.route('/user/<username>')
@login_required
def user(username):
    user = User.query.filter_by(username=username).first_or_404()
    page = request.args.get('page', 1, type=int)
    questions = user.questions.paginate(
        page, current_app.config['QUESTIONS_PER_PAGE'], False)
    next_url = url_for('main.user', username=user.username, page=questions.next_num) \
        if questions.has_next else None
    prev_url = url_for('main.user', username=user.username, page=questions.prev_num) \
        if questions.has_prev else None
    questions_dict = [q.to_dict() for q in questions.items ]  
    
    is_following = False
    if(user != current_user): 
        is_following = current_user.is_following(user) 

    nav_links = {
    "Home" : url_for('main.index') ,
    "Explore" : url_for('main.explore'),
    "Profile" : url_for('main.user', username=current_user.username),
    "Logout" : url_for('auth.logout')};
   
    context = {
        'nav_links' : nav_links ,
        'messages' : get_flashed_messages(),
        'current_user' : current_user.username,
        'user': user.to_dict() , 
        'questions': questions_dict ,
        'next_url' : next_url , 
        'prev_url': prev_url,
        'is_following' : is_following 
    }


    return render_template('user.html', user=user, questions=questions.items,
    next_url=next_url, prev_url=prev_url , frontend_data = json.dumps(context))


@bp.route('/edit_profile', methods=['GET', 'POST'])
@login_required
def edit_profile():
    form = EditProfileForm(current_user.username)
    if request.method == 'POST':
        if form.validate_on_submit():
            current_user.username = form.username.data
            current_user.about_me = form.about_me.data
            db.session.commit()
            flash('Your changes have been saved.')
            return redirect(url_for('main.user' , username = current_user.username))
        else : 
            errors = list(form.errors.keys())
            messages = list(form.errors.values())
            response = jsonify({
                'errors':errors ,
                'messages':messages })
            response.status_code = 400
            response.headers['Location'] = url_for('main.edit_profile')
            return response
        
    
    nav_links = {
        "Home" : url_for('main.index') ,
        "Explore" : url_for('main.explore'),
        "Profile" : url_for('main.user', username=current_user.username),
        "Logout" : url_for('auth.logout')};
       
    context = {
        'nav_links' : nav_links ,
        'messages' : get_flashed_messages(),
        'username' : current_user.username , 
        'about_me' : current_user.about_me ,
    }

    return render_template('edit_profile.html', title='Edit Profile',
                           form=form ,frontend_data = json.dumps(context) )

@bp.route('/question_detail/<question_id>', methods=['GET', 'POST'])
@login_required
def question_detail(question_id):
    form = AnswerForm() 
    question = Question.query.filter_by(id=question_id).first_or_404()
    if request.method == 'POST':
        if form.validate_on_submit():
            asnwer = Answer(body=form.answer.data , question = question , author = current_user)
            db.session.commit()
            flash('Your answer has been posted.')
            return redirect(url_for('main.question_detail' , question_id = question.id))
        else : 
            errors = list(form.errors.keys())
            messages = list(form.errors.values())
            response = jsonify({
                'errors':errors ,
                'messages':messages })
            response.status_code = 400
            response.headers['Location'] = url_for('main.question_detail' , question_id= question.id)
            return response
                    
    page = request.args.get('page', 1, type=int)
    answers = question.answers.paginate(
        page, current_app.config['QUESTIONS_PER_PAGE'], False)
    next_url = url_for('main.question_detail', question_id=question.id, page=answers.next_num) \
        if answers.has_next else None
    prev_url = url_for('main.question_detail', question_id=question.id, page=answers.prev_num) \
        if answers.has_prev else None
    answers_list = [a.to_dict() for a in answers.items]     

    nav_links = {
        "Home" : url_for('main.index') ,
        "Explore" : url_for('main.explore'),
        "Profile" : url_for('main.user', username=current_user.username),
        "Logout" : url_for('auth.logout')};
       
    context = {
        'nav_links' : nav_links ,
        'messages' : get_flashed_messages(),
        'question' : question.to_dict(),
        'answers' : answers_list,
        'next_url' : next_url , 
        'prev_url': prev_url,
        'current_user' : current_user.username
    }
    return render_template('question_detail.html' , title='Question' , form = form, 
        frontend_data = json.dumps(context))

@bp.route('/update_answer_is_best', methods=[ 'POST'])
@login_required
def update_answer_is_best():
    question_id = request.form.get('question_id')
    answer_id = request.form.get('answer_id')

    question = Question.query.filter_by(id = question_id).first()
    old_best = question.answers.filter_by(is_best = True).first() 
    new_best = question.answers.filter_by(id = answer_id).first()
    
    if old_best: 
        old_best.is_best = False 
    new_best.is_best = True 
    
    db.session.commit()

    response = jsonify({
        'answers': [old_best.to_dict() and old_best.to_dict() , new_best.to_dict()]
    })
    response.status_code = 200
    response.headers['Location'] = url_for('main.question_detail' , question_id = question_id)
    return response


@bp.route('/search')
@login_required
def search():
    if not g.search_form.validate():
        return redirect(url_for('main.explore'))

    page = request.args.get('page', 1, type=int)
    questions, total = Question.search(g.search_form.q.data, page,
                               current_app.config['QUESTIONS_PER_PAGE'])
    
    questions_dict = [q.to_dict() for q in questions]

    next_url = url_for('main.search', q=g.search_form.q.data, page=page + 1) \
        if total['value'] > page * current_app.config['QUESTIONS_PER_PAGE'] else None
    prev_url = url_for('main.search', q=g.search_form.q.data, page=page - 1) \
        if page > 1 else None
    
    nav_links = {
        "Home" : url_for('main.index') ,
        "Explore" : url_for('main.explore'),
        "Profile" : url_for('main.user', username=current_user.username),
        "Logout" : url_for('auth.logout')}
       
    context = {
        'nav_links' : nav_links ,
        'messages' : get_flashed_messages(),
        'questions' : questions_dict,
        'next_url' : next_url , 
        'prev_url': prev_url,
    }

    return render_template('search.html', title=('Search'), questions=questions,
        next_url=next_url, prev_url=prev_url , frontend_data = json.dumps(context))    
