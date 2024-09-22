#!/usr/bin/python3

import yaml
import os, tarfile, wave
from random import choice
from string import ascii_lowercase, digits
from flask import Flask, redirect, request, render_template

UPLOAD_DIR = "./uploads/"
EXTRACT_DIR = "./extracted/"


def checkTAR(file):
    try :
        with tarfile.open(file):
            pass
        return True
    except:
        return False

def checkPNG(file):
    try:
        with open(file, 'rb') as f:
            signature = f.read(8)
            return signature == b'\x89PNG\r\n\x1a\n'
    except Exception:
        return False

def checkPDF(file):
    return_code = os.system(f"pdfinfo {file} >/dev/null 2>&1")
    return return_code == 0

def checkWAV(file):
    try:
        with wave.open(file):
            pass
        return True
    except:
        return False


def checkFile(file):
    if checkTAR(file) and checkPNG(file) and checkPDF(file) and not checkWAV(file):
        try:
            with tarfile.open(file) as tar:
                tar.extractall(EXTRACT_DIR)
        except Exception as e:
            print(e)
            return False
        print("Files Extracted Successfully!")
        try:
            with open('{}config.yaml'.format(EXTRACT_DIR),'r') as stream:
                output = yaml.load(stream,Loader=yaml.FullLoader)     
        except Exception as e:
            print(e)
            os.system(f'rm -rf {EXTRACT_DIR}/*')
            return False
        os.system(f'rm -rf {EXTRACT_DIR}/*')
        isvalid = True
    else:
        isvalid = False
    os.system(f"rm {file}")
    return isvalid


app = Flask(__name__)
charset = digits + ascii_lowercase
randomSTR = lambda: "".join(choice(charset) for _ in range(10))


@app.route("/", methods=["GET"])

def root():
    return render_template("index.html")
    
@app.route('/upload', methods=['GET', 'POST'])

def upload_file():
    if request.method == "POST":
        f = request.files.get('upload-file')
        if not f:
            return render_template("nofile.html"), 400
        file_location = os.path.join(UPLOAD_DIR, randomSTR())
        f.save(file_location)
        if checkFile(file_location):
            return render_template("success.html")
        else:
            return render_template("fail.html")
    else:
        return redirect("/")
@app.errorhandler(404)

def not_found(e):
    return render_template('404.html'), 404


