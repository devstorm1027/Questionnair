import pandas as pd
import os
from shutil import copyfile

class loader(object):

    # Pull the data from question csv
    def data_from_csv(self):
        questions = []
        with open('question.csv') as csvfile:
            for line in csvfile.readlines():
                array = line.replace('"', '').replace(", ", ' ').split(',')
                questions.append(array)
        questions = questions[1:]
        return questions

    def data_from_out_csv(self):
        questions = []
        with open('question_out.csv') as csvfile:
            for line in csvfile.readlines():
                array = line.replace('"', '').replace(", ", ' ').split(',')
                questions.append(array)
        questions = questions[1:]
        return questions

    # Check the group id from question csv
    def group_id_list(self):
        group_data = []
        questions = self.data_from_csv()
        for question in questions:
            group_data.append(question[4])
        group_data = list(set(group_data))
        group_data.sort()
        return group_data

    # Pull the data by group id
    def pull_group_data(self, path):
        combine_output_path = "question_out.csv"
        group_data = []
        group_id = path.split('_')[-1]
        if os.path.isfile(combine_output_path):
            questions = self.data_from_out_csv()
        else:
            questions = self.data_from_csv()
        for question in questions:
            if question[4].replace('\n', '') == str(group_id):
                group_data.append(question)
        return group_data, str(group_id)

    # Pull the data for Wizard format
    def pull_all_data(self):
        combine_output_path = "question_out.csv"
        if os.path.isfile(combine_output_path):
            questions = self.data_from_out_csv()
        else:
            questions = self.data_from_csv()
        sorted_questions = []
        for question in questions:
            if question and question[0].count('.') == 1:
                parent_id = question[5].replace('\n', ''). split('.')[0]
                sorted_questions.append(sorted_questions[int(parent_id) - 1].append(question))
            else:
                sorted_questions.append(question)
        sorted_questions = list(filter(None.__ne__, sorted_questions))
        return sorted_questions

    # Save the data for answer and description
    def select_register(self, reg_info):
        description = []
        answers = []
        result = None
        for (key, value) in reg_info.items():
            if 'desc' in key:
                description.append(value.replace('\r\n', ''))
            if 'answer' in key:
                answers.append(value.replace('\r\n', ''))
        if description:
            field_name = 'Long Description'
            result = self.export_to_csv(field_name, reg_info)
        if answers:
            field_name = 'OutPutLabel'
            result = self.export_to_csv(field_name, reg_info)
        return result

    # Update the csv file with new data
    def export_to_csv(self, field_name, reg_info):

        combine_output_path = "question_out.csv"
        if os.path.isfile(combine_output_path):
            df = pd.read_csv(combine_output_path)
        else:
            copyfile('question.csv', combine_output_path)
            df = pd.read_csv(combine_output_path)

        question_ids = df['QuestionID']
        try:
            for id in question_ids:
                for (key, value) in reg_info.items():
                    if id == float(key.split('_')[1]):
                        index = list(question_ids).index(id)
                        df[field_name][index] = value.replace('\r\n', ' ')
            df.to_csv(combine_output_path, index=False, float_format='%g')
            result = 'Successfully saved the data'
        except Exception as e:
            print(e)
            result = 'Error when save the data'
        return result