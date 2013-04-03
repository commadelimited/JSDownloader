import os
import downloading
from flask import Flask, render_template, request

application = Flask(__name__)
application.debug = True


@application.route('/')
def index(name=None):
    # import pdb;pdb.set_trace()
    return render_template('index.html')


@application.route('/download/', methods=["POST"])
def download():
    if request.method == 'POST':
        downloading.Downloading(request.form['downloadurl'])
    return render_template('index.html')










if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    application.run(host='0.0.0.0', port=port)
