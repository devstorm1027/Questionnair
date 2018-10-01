from flask import Flask, render_template, request
from database import database

app = Flask(__name__)

@app.route('/', methods=['POST', 'GET'])
def main():
    loader = database.loader()
    loader.select_register(reg_info=request.form)
    group_id_list = loader.group_id_list()
    return render_template('index.html', value=group_id_list)

@app.route('/questionnaire', methods=['POST', 'GET'])
def questionnaire():
    loader = database.loader()
    data = loader.pull_all_data()
    return render_template('questionnaire.html', value=data)

@app.route('/wizard')
def wizard():
    loader = database.loader()
    data = loader.pull_all_data()
    return render_template('wizard.html', value=data)

@app.route('/<group>')
def group(group):
    loader = database.loader()
    data, group_id = loader.pull_group_data(request.path)

    value = {'data': data, 'group_id': group_id}
    return render_template('group.html', value=value)

@app.route('/view', methods=['POST', 'GET'])
def view_result():
    loader = database.loader()
    alert = loader.select_register(reg_info=request.form)
    all_data = loader.data_from_out_csv()
    output_label = ['NameTXT', 'ColorTXT', 'FoodTXT', 'SnowboardTXT', 'PlaceTXT', 'RunTXT']
    value = {'alert': alert, 'data': all_data, 'output_label': output_label}
    return render_template('view.html', value=value)

if __name__ == '__main__':
    print('running on 5000')
    app.run()