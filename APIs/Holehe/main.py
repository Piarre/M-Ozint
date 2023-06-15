import csv
import glob
import json
import os
import os.path

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


@app.route("/email/<email>")
def doEmailExists(email):
    os.system(f'holehe -C --only-used --no-color {email}')
    list_of_files = glob.glob(os.getcwd() + "/*.csv")
    latest_file = max(list_of_files, key=os.path.getctime)
    data = []
    with open(latest_file, "r") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row["exists"].lower() == "true":
                data.append(row["name"])

    result = {"name": "", "provider": data}
    json_result = json.dumps(result)
    return json_result


@app.route("/phone/<number>")
def doNumberExists(number):
    os.chdir("/toutatis")
    os.listdir("./")
    # os.system(f'holehe -C --only-used --no-color {email}')
    # list_of_files = glob.glob(os.getcwd() + "/*.csv")
    # latest_file = max(list_of_files, key=os.path.getctime)
    # data = []
    # with open(latest_file, "r") as csvfile:
    #     reader = csv.DictReader(csvfile)
    #     for row in reader:
    #         if row["exists"].lower() == "true":
    #             data.append(row["name"])
    #
    # result = {"names": data}
    # json_result = json.dumps(result)
    return number


if __name__ == "__main__":
    app.run()
