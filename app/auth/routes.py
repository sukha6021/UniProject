from flask import render_template ,get_flashed_messages, flash, redirect ,request , url_for , jsonify
from flask_login import current_user, login_user , logout_user , login_required
from werkzeug.urls import url_parse
from .email import send_password_reset_email
from .forms import LoginForm , RegistrationForm, ResetPasswordRequestForm, ResetPasswordForm 
from ..models import User 
from datetime import datetime
from . import bp 
from app import db
import json

@bp.route('/login' , methods=['GET', 'POST'])
def login():
    nav_links = {"Home":url_for('main.index') , "Explore":url_for('main.explore'),"Login":url_for('auth.login')};
    context = {
        'nav_links' : nav_links ,
        'messages' : get_flashed_messages(),
        'register_url': url_for('auth.register'),
        'reset_url': url_for('auth.reset_password_request'),
        'errors' : []
    }
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    
    form = LoginForm()
    if request.method == 'POST':    
        if form.validate_on_submit():
            user = User.query.filter_by(username=form.username.data).first()
            
            if user is None or not user.check_password(form.password.data):
                
                if user is None:
                    context['errors'].append('username') 
                else:
                    context['errors'].append('password') if not user.check_password(form.password.data) else None             
                
                response = jsonify({'errors': context['errors'] , 'messages': ['Invalid username or password'] })
                response.status_code = 400
                response.headers['Location'] = url_for('auth.login')
                return response
            
            login_user(user , remember = form.remember_me.data)
            next_page = request.args.get('next')
            
            if not next_page or url_parse(next_page).netloc != '':
                next_page = url_for('main.index')
            return redirect(next_page)

        for key in form.errors: 
           context['errors'].append(key)
        
        response = jsonify({'errors': context['errors'], 'messages': ['Please fill in username and password'] })
        response.status_code = 400
        response.headers['Location'] = url_for('auth.login')
        return response

    return render_template('auth/login.html',title='Sign In' , frontend_data = json.dumps(context))

@bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('main.index'))

@bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    form = RegistrationForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            user = User(username=form.username.data, email=form.email.data)
            user.set_password(form.password.data)
            db.session.add(user)
            db.session.commit()
            flash('Congratulations, you are now a registered user!')
            return redirect(url_for('auth.login'))
        else: 
            errors = list(form.errors.keys())
            messages = list(form.errors.values())
            response = jsonify({
                'errors':errors ,
                'messages':messages })
            response.status_code = 400
            response.headers['Location'] = url_for('auth.register')
            return response

    nav_links = {"Home":url_for('main.index') , "Explore":url_for('main.explore'),"Login":url_for('auth.login')};
   
    context = {
        'nav_links' : nav_links ,
        'messages' : get_flashed_messages(),
    }    
    
    return render_template('auth/register.html', title='Register', frontend_data = json.dumps(context))


@bp.route('/reset_password_request', methods=['GET', 'POST'])
def reset_password_request():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))

    form = ResetPasswordRequestForm()
    
    if request.method == 'POST':
        if form.validate_on_submit():
            user = User.query.filter_by(email=form.email.data).first()
            if user:
                send_password_reset_email(user)
            flash('Check your email for the instructions to reset your password')
            return redirect(url_for('auth.login'))
        else: 
            errors = list(form.errors.keys())
            messages = list(form.errors.values())
            response = jsonify({
                'errors':errors ,
                'messages':messages })
            response.status_code = 400
            response.headers['Location'] = url_for('auth.reset_password_request')
            return response

    nav_links = {"Home":url_for('main.index') , "Explore":url_for('main.explore'),"Login":url_for('auth.login')};
    context = {
        'nav_links' : nav_links ,
        'messages' : get_flashed_messages(),

    } 

    return render_template('auth/reset_password_request.html',
                           title='Reset Password', frontend_data = json.dumps(context))



@bp.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    user = User.verify_reset_password_token(token)
    if not user:
        return redirect(url_for('main.index'))
    form = ResetPasswordForm()
    if request.method == "POST":
        if form.validate_on_submit():
            user.set_password(form.password.data)
            db.session.commit()
            flash('Your password has been reset.')
            return redirect(url_for('auth.login'))
        else: 
            errors = list(form.errors.keys())
            messages = list(form.errors.values())
            response = jsonify({
                'errors':errors ,
                'messages':messages })
            response.status_code = 400
            response.headers['Location'] = url_for('auth.reset_password_request')
            return response
    
    nav_links = {"Home":url_for('main.index') , "Explore":url_for('main.explore'),"Login":url_for('auth.login')};
   
    context = {
        'nav_links' : nav_links ,
        'messages' : get_flashed_messages(),
        'token' : token

    } 
    return render_template('auth/reset_password.html', frontend_data = json.dumps(context))