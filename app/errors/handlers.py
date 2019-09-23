from flask import render_template , request
from app import db
from app.errors import bp
from app.api.errors import error_response as api_error_response
from flask_wtf.csrf import CSRFError



def wants_json_response():
    return request.accept_mimetypes['application/json'] >= \
        request.accept_mimetypes['text/html']

#declare a costum error
@bp.app_errorhandler(404)
def not_found_error(error):
	if wants_json_response():
		return api_error_response(404)
	return render_template('errors/404.html'), 404

#envoked after a datebase error
@bp.app_errorhandler(500)
def internal_error(error):
    db.session.rollback()
    if wants_json_response():
        return api_error_response(500)
    return render_template('errors/500.html'), 500

@bp.app_errorhandler(CSRFError)
def handle_csrf_error(e):
    return render_template('csrf_error.html', reason=e.description), 400