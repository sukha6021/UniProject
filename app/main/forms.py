from flask import request 
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField
from wtforms.validators import DataRequired  , ValidationError, Length
from ..models import User

class EditProfileForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    about_me = TextAreaField('About me', validators=[Length(min=0, max=140)])
    submit = SubmitField('Submit')

    def __init__(self, original_username, *args, **kwargs):
        super(EditProfileForm, self).__init__(*args, **kwargs)
        self.original_username = original_username

    def validate_username(self, username):
        if username.data != self.original_username:
            user = User.query.filter_by(username=self.username.data).first()
            if user is not None:
                raise ValidationError('Please use a different username.')            

class QuestionForm(FlaskForm):
    title = StringField('Title' , validators=[DataRequired()])
    question = TextAreaField('Ask Your Question ', validators=[
        DataRequired(), Length(min=1, max=140)])

    submit = SubmitField('Submit')

class AnswerForm(FlaskForm):
    answer = TextAreaField('Write your Answer', validators=[
        DataRequired(), Length(min=1, max=140)])
    
    submit = SubmitField('Submit your answer.')

class SearchForm(FlaskForm):
    q = StringField(('Search'), validators=[DataRequired()])

    def __init__(self, *args, **kwargs):
        if 'formdata' not in kwargs:
            kwargs['formdata'] = request.args
        if 'csrf_enabled' not in kwargs:
            kwargs['csrf_enabled'] = False
        super(SearchForm, self).__init__(*args, **kwargs)

