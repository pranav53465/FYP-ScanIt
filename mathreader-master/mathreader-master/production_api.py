# -*- coding: utf-8 -*-
#from api import *
import base64
from mathreader.api import *
from mathreader.config import Configuration
from mathreader.helpers.exceptions import *
import sys
import traceback
import requests
from flask import Flask
from flask import redirect, make_response, request
from flask import render_template
from mathreader import api
from mathreader.helpers.exceptions import GrammarError, LexicalError, SintaticError
import os
import inspect
import json
import re
import time



app = Flask(__name__)

@app.route('/recognize', methods = ['GET', 'POST'])
def recognize():

    latex = ""
    error = False

    try:
        
        data = request.json
        print("data: ", data)
        img_url = data['img_url']
        print("image: ", img_url)
        
        img_data = base64.b64encode(requests.get(img_url).content)

        hme_recognizer = api.HME_Recognizer()
        hme_recognizer.load_image(img_data)
        latex, modified_img = hme_recognizer.recognize()
        hme_recognizer = None
        

    except Exception as e:
        print(traceback.format_exc())
	    #print(sys.exc_info()[0])
        if hasattr(e, 'data'):
            if 'latex_string_original' in e.data:
                latex = e.data['latex_string_original']
                error = True
            print(e.data)
    print("result from math reader: ", latex)
    return json.dumps({
        'latex': latex,
        'error': error
    })

# Run Server
if __name__ == '__main__':
  app.debug = True
  app.run(host = '0.0.0.0', port=5226)
