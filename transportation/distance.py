    from flask import Flask,jsonify,make_response,abort,request,url_for
    from flask_cors import CORS

    ml_app = Flask(__name__)
    CORS(ml_app)

    tasks = [
        {
            'id': 1,
            'title': u'Buy groceries',
            'description': u'Milk, Cheese, Pizza, Fruit, Tylenol', 
            'done': False
        },
        {
            'id': 2,
            'title': u'Learn Python',
            'description': u'Need to find a good Python tutorial on the web', 
            'done': False
        }
    ]

    @ml_app.route('/')
    def index():
        return "Hello, World!"
    def make_public_task(task):
        new_task = {}
        for field in task:
            if(field == 'id'):
                new_task['uri'] = url_for('get_task', task_id=task['id'], _external=True)
            else:
                new_task[field] = task[field]
        return new_task

    @ml_app.route('/todo/api/v1.0/tasks', methods=['GET'])
    def get_tasks_full():
    	if(len(tasks)==0):
    		abort(404)
    	return jsonify({'tasks': [make_public_task(task) for task in tasks]})

    @ml_app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['GET'])
    def get_task(task_id):
        task = [task for task in tasks if task['id'] == task_id]
        if(len(task) == 0):
            abort(404)
        return jsonify({'task': task[0]})



    @ml_app.errorhandler(404)
    def not_found(error):
    	return make_response(jsonify({'error':'Not Found'}),404)


    @ml_app.route('/todo/api/v1.0/tasks', methods=['POST'])
    def create_task():
        if(not request.json or not 'title' in request.json):
            abort(400)
        task = {
            'id': tasks[-1]['id'] + 1,
            'title': request.json['title'],
            'description': request.json.get('description', ""),
            'done': False
        }
        tasks.append(task)
        return jsonify({'task': task}), 201

    @ml_app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['PUT'])
    def update_task(task_id):
        task = [task for task in tasks if task['id'] == task_id]
        if(len(task) == 0):
            abort(404)
        if(not request.json):
            abort(400)
        if( ('title' in request.json) and (type(request.json['title']) is not str) ):
            abort(400)
        if( ('description' in request.json) and (type(request.json['description']) is not str) ):
            abort(400)
        if( ('done' in request.json) and (type(request.json['done']) is not bool) ):
            abort(400)
        task[0]['title'] = request.json.get('title', task[0]['title'])
        task[0]['description'] = request.json.get('description', task[0]['description'])
        task[0]['done'] = request.json.get('done', task[0]['done'])
        return jsonify({'task': task[0]})

    @ml_app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['DELETE'])
    def delete_task(task_id):
        task = [task for task in tasks if task['id'] == task_id]
        if len(task) == 0:
            abort(404)
        tasks.remove(task[0])
        return jsonify({'result': True})    

    if __name__ == '__main__':
    	ml_app.run(debug=True)
