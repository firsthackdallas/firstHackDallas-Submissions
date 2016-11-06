from system.core.controller import *
from flask import flash

class Users(Controller):
    def __init__(self, action):
        super(Users, self).__init__(action)
        self.load_model('User')
        self.load_model('Service')

    def index(self):
        return self.load_view('index.html')

    def login_reg(self):
        return self.load_view('login_reg.html')

    def login(self):
        print 'got to login'
        user = self.models['User'].get_user_by_email(request.form.copy())
        if user['status'] == True:
            session['user'] = user['user']
        else:
            for message in user['errors']:
                flash(message, 'login_errors')
            return redirect('/login_reg')
        return redirect('/user')

    def register(self):
        result = self.models['User'].add_users(request.form.copy())
        if result['status'] == True:
            return redirect('/edit_user')
        else:
            for message in result['errors']:
                flash(message, 'regis_errors')
            return redirect('/login_reg')
        if not 'id' in [session]:
            session['id'] = user[0][id]
        return redirect('/edit_user')

    def edit(self):
        preferences = self.models['User'].get_preferences_by_id(session['user']['id'])
        return self.load_view('edit_user.html', preferences = preferences)

    def dash(self):
        # services = self.models['Service'].get_services_by_user_preference(session['id'])
        # favorites = self.models['Service'].get_user_favorites(session['id'])
        return self.load_view('user_dash.html')

    def update_user(self):
        result = self.models['User'].update_user_by_id(session['user']['id'], request.form.copy())
        if result['status'] == True:
            flash("Your information has been updated successfully")
            return redirect('/edit')
        else:
            flash("Please input correct information")
            return redirect('/edit_user')

    def update_pref(self):
        result = self.models['User'].update_prefrences_by_id(session['user']['id'], request.form.copy())
        if result['status'] == True:
            return redirect('/user')
        else:
            result = self.models['User'].insert_preferences(session['user']['id'], request.form.copy())
            if result > 0:
                flash("Your preferences have been updated successfully")
                return redirect('/edit_user')
            else:
                flash("Please input correct information")
                return redirect('/edit_user')

    def admin(self):
        feedback = self.models['Feedback'].get_feedback_by_status()
        return self.load_view('admin.html')

    def admin_feedback(self):
        feedback = self.models['Feedback'].get_feedback_by_status()
        return self.load_view('all_feedback.html')

    def logout(self):
        if 'id' in session:
            session['id'] = 0
        return redirect('/')

    #def signin(self):
    #    return self.load_view('signin.html')

    #def register(self):
    #    return self.load_view('register.html')

    #def registerNew(self):
    #    result = self.models['User'].add_users(request.form.copy())
    #    if result['status'] == True:
    #        if result['user'][0]['user_level'] == 'admin':
    #            if not 'id' in session:
    #                session['id'] = 0
    #            session['id'] = result['user'][0]['id']
    #            return redirect('/dashboard/admin')
    #    print 'Send flash message to screen stating what happened'
    #    return redirect('/')

    #def addUser(self):
    #    result = self.models['User'].add_users(request.form.copy())
    #    if result['status'] == True:
    #        if result['user'][0]['user_level'] == 'admin':
    #            if not 'id' in session:
    #                session['id'] = 0
    #            session['id'] = result['user'][0]['id']
    #            return redirect('/admin')
    #    print 'Send flash message to screen stating what happened'
    #    return redirect('/')

    #def showAddUser(self):
    #    return self.load_view('adduser.html')

    #def adminAddUser(self):
    #    result = self.models['User'].add_users(request.form.copy())
    #    pass

    #def admin(self):
    #    result = self.models['User'].get_all_users()
    #    return self.load_view('admin.html', users = result)

    #def userpage(self, id):
    #    result = self.models['User'].get_wall_info(id)
    #    return self.load_view('profilepage.html', user = result[0])
