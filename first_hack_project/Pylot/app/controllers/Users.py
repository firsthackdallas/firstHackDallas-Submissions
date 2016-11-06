from system.core.controller import *

class Users(Controller):
    def __init__(self, action):
        super(Users, self).__init__(action)

        self.load_model('User')

    def index(self):
        services = self.models['User'].displayServices()
        return self.load_view('index.html',services=services)

    def process(self):
        if request.form['home'] == 'register':
            user = {
                'email':request.form['email'],
                'alias':request.form['alias'],
                'zip':request.form['zip'],
                'password':request.form['password'],
                'confirm':request.form['confirm']
            }
            create_status = self.models['User'].register(user)
            if create_status['status'] == True:
                session['user'] = create_status['user']
                services = self.models['User'].displayServices()
                return self.load_view('index.html',services=services)
            else:
                for message in create_status['errors']:
                    flash(message)
                return redirect('/')
        elif request.form['home'] == 'login':
            user = {
                'email':request.form['email'],
                'password':request.form['password']
            }
            create_status = self.models['User'].login(user)
            if create_status['status'] == True:
                session['user'] = create_status['user']
                quotes = self.models['User'].displayServices()
                return self.load_view('index.html',services=services)
            else:
                for message in create_status['errors']:
                    flash(message)
                return redirect('/')

    def services(self):
        services = self.models['User'].displayResults(session['User']['zip'])
        return self.load_view('results.html',services=services)

    def admin(self):
        services = self.models['User'].displayAdmin()
        return self.load_view('admin.html',services=services)

    def adminAddSP(self):
        self.models['User'].addSP()
        return redirect('/admin')

    def adminUpdateSP(self):
        self.models['User'].updateSP(request.form.copy())
        return redirect('/admin')
    def register(self):
        self.models['User'].register(request.form.copy())
        return redirect('/admin')
