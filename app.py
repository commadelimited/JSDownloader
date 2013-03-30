import os
from flask import Flask, render_template

application = Flask(__name__)
application.debug = True


@application.route('/')
def index(name=None):
    return render_template('signin.html')


@application.route('/login/', methods=["GET", "POST"])
def login():
    return render_template('signin.html', msg='Login failed. Please try again')


if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    application.run(host='0.0.0.0', port=port)
